package com.project.perphorum.controllers;

import com.project.perphorum.dtos.UserSummary;
import com.project.perphorum.model.AppUser;
import com.project.perphorum.model.Perfume;
import com.project.perphorum.repos.AppUserRepository;
import com.project.perphorum.repos.PerfumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AppUserController {

    private final AppUserRepository userRepository;
    private final PerfumeRepository perfumeRepository;

    // 1. WYSZUKIWARKA UŻYTKOWNIKÓW (Szukanie znajomych)
    // GET http://localhost:8080/api/users/search?query=marek
    @GetMapping("/search")
    public List<UserSummary> searchUsers(@RequestParam String query) {
        return userRepository.findByUsernameContainingIgnoreCase(query)
                .stream()
                .map(u -> new UserSummary(u.getId(), u.getUsername()))
                .toList();
    }

    // 2. ZARZĄDZANIE WISHLISTĄ (Chcę to mieć) - Toggle
    // POST http://localhost:8080/api/users/wishlist?userId=1&perfumeId=50
    @PostMapping("/wishlist")
    public ResponseEntity<?> toggleWishlist(@RequestParam Long userId, @RequestParam Long perfumeId) {
        var user = userRepository.findById(userId).orElseThrow();
        var perfume = perfumeRepository.findById(perfumeId).orElseThrow();

        if (user.getWishlistPerfumes().contains(perfume)) {
            user.getWishlistPerfumes().remove(perfume);
            userRepository.save(user);
            return ResponseEntity.ok("Usunięto z Wishlisty");
        } else {
            user.getWishlistPerfumes().add(perfume);
            userRepository.save(user);
            return ResponseEntity.ok("Dodano do Wishlisty");
        }
    }

    // 3. ZARZĄDZANIE POSIADANYMI (Mam to) - Toggle
    // POST http://localhost:8080/api/users/owned?userId=1&perfumeId=50
    @PostMapping("/owned")
    public ResponseEntity<?> toggleOwned(@RequestParam Long userId, @RequestParam Long perfumeId) {
        var user = userRepository.findById(userId).orElseThrow();
        var perfume = perfumeRepository.findById(perfumeId).orElseThrow();

        if (user.getOwnedPerfumes().contains(perfume)) {
            user.getOwnedPerfumes().remove(perfume);
            userRepository.save(user);
            return ResponseEntity.ok("Usunięto z Posiadanych");
        } else {
            user.getOwnedPerfumes().add(perfume);
            userRepository.save(user);
            return ResponseEntity.ok("Dodano do Posiadanych");
        }
    }
    // 4. GET WISHLISTY
    // GET http://localhost:8080/api/users/1/wishlist
    @GetMapping("/{userId}/wishlist")
    public ResponseEntity<List<Perfume>> getUserWishlist(@PathVariable Long userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        return ResponseEntity.ok(user.getWishlistPerfumes());
    }
    //GET POSIADANE
    // GET http://localhost:8080/api/users/1/owned
    @GetMapping("/{userId}/owned")
    public ResponseEntity<List<Perfume>> getUserOwnedList(@PathVariable Long userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        return ResponseEntity.ok(user.getOwnedPerfumes());
    }

    // 6. ZARZĄDZANIE ZNAJOMYMI (Dodaj/Usuń)
    // POST http://localhost:8080/api/users/friend?myId=1&targetId=2
    @PostMapping("/friend")
    public ResponseEntity<?> toggleFriend(@RequestParam Long myId, @RequestParam Long targetId) {
        if (myId.equals(targetId)) {
            return ResponseEntity.badRequest().body("Nie możesz dodać samego siebie do znajomych!");
        }

        var me = userRepository.findById(myId).orElseThrow();
        var targetUser = userRepository.findById(targetId).orElseThrow();

        if (me.getFriends().contains(targetUser)) {
            me.getFriends().remove(targetUser);
            userRepository.save(me);
            return ResponseEntity.ok("Usunięto ze znajomych: " + targetUser.getUsername());
        } else {
            me.getFriends().add(targetUser);
            userRepository.save(me);
            return ResponseEntity.ok("Dodano do znajomych: " + targetUser.getUsername());
        }
    }
}