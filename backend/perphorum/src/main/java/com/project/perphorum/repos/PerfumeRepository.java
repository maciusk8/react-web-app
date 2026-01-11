package com.project.perphorum.repos;

import com.project.perphorum.model.Perfume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PerfumeRepository extends JpaRepository<Perfume, Long> {

    List<Perfume> findByNameContainingIgnoreCase(String name);

    List<Perfume> findByBrandIgnoreCase(String brand);

    List<Perfume> findByGenderIgnoreCase(String gender);

    List<Perfume> findByIngredientsContainingIgnoreCase(String ingredient);
}