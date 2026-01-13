package com.project.perphorum.controllers;

import com.project.perphorum.dtos.CreateReviewRequest;
import com.project.perphorum.model.AppUser;
import com.project.perphorum.model.Perfume;
import com.project.perphorum.model.Review;
import com.project.perphorum.repos.AppUserRepository;
import com.project.perphorum.repos.PerfumeRepository;
import com.project.perphorum.repos.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final PerfumeRepository perfumeRepository;
    private final AppUserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody CreateReviewRequest request) {

        var perfume = perfumeRepository.findById(request.getPerfumeId())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono perfum o ID: " + request.getPerfumeId()));

        var user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika o ID: " + request.getUserId()));

        // one review per user per perfume
        if (reviewRepository.existsByAuthorAndSubject(user, perfume)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Już dodałeś recenzję dla perfum: " + perfume.getName());
        }

        Review review = new Review();
        review.setText(request.getText());
        review.setRating(request.getRating());
        review.setSubject(perfume);
        review.setAuthor(user);

        reviewRepository.save(review);

        return ResponseEntity.status(HttpStatus.CREATED).body("Recenzja dodana pomyślnie!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        if (!reviewRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reviewRepository.deleteById(id);
        return ResponseEntity.ok("Recenzja została usunięta.");
    }

    @PostMapping("/{reviewId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long reviewId, @RequestParam Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Recenzja nie istnieje"));
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie istnieje"));

        if (review.getLikes().contains(user)) {
            review.getLikes().remove(user);
        } else {
            review.getLikes().add(user);
        }

        reviewRepository.save(review); // Zapisz zmiany w bazie (tabela review_likes)

        return ResponseEntity.ok(review.getLikesCount());
    }

    @GetMapping("/perfume/{perfumeId}")
    public ResponseEntity<List<Review>> getReviewsByPerfume(@PathVariable Long perfumeId) {
        Perfume perfume = perfumeRepository.findById(perfumeId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono perfum"));

        return ResponseEntity.ok(perfume.getReviews());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable Long userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        return ResponseEntity.ok(reviewRepository.findByAuthorOrderByCreatedAtDesc(user));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<Review>> getMyFeed(@RequestParam Long userId) {
        var me = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var myFriends = me.getFriends();

        if (myFriends.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<Review> feed = reviewRepository.findByAuthorInOrderByCreatedAtDesc(myFriends);

        return ResponseEntity.ok(feed);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Review>> getRecentReviews(@RequestParam(defaultValue = "6") int limit) {
        List<Review> recentReviews = reviewRepository.findAllByOrderByCreatedAtDesc();

        // Return only the requested number of reviews
        if (recentReviews.size() > limit) {
            recentReviews = recentReviews.subList(0, limit);
        }

        return ResponseEntity.ok(recentReviews);
    }
}