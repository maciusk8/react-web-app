package com.project.perphorum.controllers;

import com.project.perphorum.model.Perfume;
import com.project.perphorum.repos.PerfumeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/perfumes")
@CrossOrigin("*")
public class PerfumeController {

    private final PerfumeRepository repository;

    public PerfumeController(PerfumeRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Perfume> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Perfume> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(perfume -> ResponseEntity.ok(perfume))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Perfume> searchByName(@RequestParam String text) {
        return repository.findByNameContainingIgnoreCase(text);
    }

    @GetMapping("/brand/{brandName}")
    public List<Perfume> getByBrand(@PathVariable String brandName) {
        return repository.findByBrandIgnoreCase(brandName);
    }

    @GetMapping("/ingredient")
    public List<Perfume> getByIngredient(@RequestParam String name) {
        return repository.findByIngredientsContainingIgnoreCase(name);
    }

    @GetMapping("/gender/{gender}")
    public List<Perfume> getByGender(@PathVariable String gender) {
        return repository.findByGenderIgnoreCase(gender);
    }
}