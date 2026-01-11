package com.project.perphorum.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter @Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;

    @Column(columnDefinition = "TEXT")
    private String text;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"password", "friends", "ownedPerfumes", "wishlistPerfumes", "reviews"})
    private AppUser author;

    @ManyToOne
    @JoinColumn(name = "perfume_id")
    @JsonIgnoreProperties({"description", "ingredients", "reviews"})
    private Perfume subject;

    //atomic lick count
    @ManyToMany
    @JoinTable(
            name = "review_likes",
            joinColumns = @JoinColumn(name = "review_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnoreProperties({"password", "friends", "ownedPerfumes", "wishlistPerfumes", "reviews"})
    private Set<AppUser> likes = new HashSet<>();

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;
    public int getLikesCount() {
        return likes.size();
    }
}