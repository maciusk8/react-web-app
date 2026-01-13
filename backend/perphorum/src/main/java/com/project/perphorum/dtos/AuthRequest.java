package com.project.perphorum.dtos;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}
