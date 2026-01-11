package com.project.perphorum;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.perphorum.model.Perfume;
import com.project.perphorum.repos.PerfumeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final PerfumeRepository repository;
    private final ObjectMapper objectMapper;

    public DataLoader(PerfumeRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            System.out.println("import start");
            //try with resources
            try (InputStream inputStream = TypeReference.class.getResourceAsStream("/perfumes.json")) {

                if (inputStream == null) {
                    throw new IOException("file not found");
                }
                List<Perfume> perfumes = objectMapper.readValue(inputStream, new TypeReference<List<Perfume>>(){});

                repository.saveAll(perfumes);
                System.out.println("succes " + perfumes.size() + " loaded");

            } catch (IOException e) {
                System.out.println("import error: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}