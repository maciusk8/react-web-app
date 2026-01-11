package com.project.perphorum.dtos;
import lombok.Data;

@Data
public class CreateReviewRequest {
    private Long perfumeId;
    private Long userId;
    private String text;
    private int rating;
}