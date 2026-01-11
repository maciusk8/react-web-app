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

    // GET http://localhost:8080/api/perfumes
    @GetMapping
    public List<Perfume> getAll() {
        return repository.findAll();
    }

    // GET http://localhost:8080/api/perfumes/5
    @GetMapping("/{id}")
    public ResponseEntity<Perfume> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(perfume -> ResponseEntity.ok(perfume)) // Jeśli znaleziono -> 200 OK
                .orElse(ResponseEntity.notFound().build()); // Jeśli nie -> 404 Not Found
    }

    // GET http://localhost:8080/api/perfumes/search?text=chanel
    @GetMapping("/search")
    public List<Perfume> searchByName(@RequestParam String text) {
        return repository.findByNameContainingIgnoreCase(text);
    }

    // GET http://localhost:8080/api/perfumes/brand/Fiorucci
    @GetMapping("/brand/{brandName}")
    public List<Perfume> getByBrand(@PathVariable String brandName) {
        return repository.findByBrandIgnoreCase(brandName);
    }

    // GET http://localhost:8080/api/perfumes/ingredient?name=Rose
    @GetMapping("/ingredient")
    public List<Perfume> getByIngredient(@RequestParam String name) {
        return repository.findByIngredientsContainingIgnoreCase(name);
    }

    // GET http://localhost:8080/api/perfumes/gender/Female
    @GetMapping("/gender/{gender}")
    public List<Perfume> getByGender(@PathVariable String gender) {
        return repository.findByGenderIgnoreCase(gender);
    }
}