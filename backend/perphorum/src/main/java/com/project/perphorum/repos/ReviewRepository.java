package com.project.perphorum.repos;

import com.project.perphorum.model.AppUser;
import com.project.perphorum.model.Perfume;
import com.project.perphorum.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByAuthorAndSubject(AppUser author, Perfume subject);

    List<Review> findByAuthorInOrderByCreatedAtDesc(Collection<AppUser> authors);

    List<Review> findByAuthorOrderByCreatedAtDesc(AppUser author);

    List<Review> findAllByOrderByCreatedAtDesc();
}