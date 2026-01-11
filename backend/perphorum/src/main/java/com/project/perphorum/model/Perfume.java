package com.project.perphorum.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Perfume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("brand")
    private String brand;

    @JsonProperty("name_perfume")
    private String name;

    @JsonProperty("family")
    private String family;

    @JsonProperty("subfamily")
    private String subfamily;

    @JsonProperty("gender")
    private String gender;

    @Lob
    @Column(columnDefinition = "TEXT")
    @JsonProperty("description")
    private String description;

    @ElementCollection
    @JsonProperty("ingredients")
    private List<String> ingredients;

    @JsonProperty("image_name")
    private String imageName;

    @OneToMany(mappedBy = "subject")
    @JsonIgnoreProperties("subject")
    private List<Review> reviews;
}