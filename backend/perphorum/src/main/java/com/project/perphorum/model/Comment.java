package com.project.perphorum.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({ "password", "friends", "ownedPerfumes", "wishlistPerfumes", "email", "reviews" })
    private AppUser author;

    @ManyToOne
    @JoinColumn(name = "review_id")
    @JsonIgnore // important for stack overflow
    private Review review;
}