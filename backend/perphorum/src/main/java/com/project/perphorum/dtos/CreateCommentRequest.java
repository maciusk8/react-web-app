package com.project.perphorum.dtos;

import lombok.Data;

@Data
public class CreateCommentRequest {
    private Long reviewId;
    private Long userId;
    private String text;
}