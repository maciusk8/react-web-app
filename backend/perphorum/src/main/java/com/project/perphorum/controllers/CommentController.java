package com.project.perphorum.controllers;

import com.project.perphorum.dtos.CreateCommentRequest;
import com.project.perphorum.model.Comment;
import com.project.perphorum.repos.AppUserRepository;
import com.project.perphorum.repos.CommentRepository;
import com.project.perphorum.repos.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CommentController {

    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;
    private final AppUserRepository userRepository;

    // DODAJ KOMENTARZ
    // POST http://localhost:8080/api/comments
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody CreateCommentRequest request) {

        var review = reviewRepository.findById(request.getReviewId())
                .orElseThrow(() -> new RuntimeException("Recenzja nie istnieje"));

        var author = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Użytkownik nie istnieje"));

        Comment comment = new Comment();
        comment.setText(request.getText());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setReview(review);
        comment.setAuthor(author);

        commentRepository.save(comment);

        return ResponseEntity.ok("Komentarz dodany!");
    }

    // USUŃ KOMENTARZ
    // DELETE http://localhost:8080/api/comments/12
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        if (!commentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        commentRepository.deleteById(id);
        return ResponseEntity.ok("Komentarz usunięty.");
    }
}