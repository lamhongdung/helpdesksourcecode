package com.ez.controller;

import com.ez.domain.User;
import com.ez.domain.UserPrincipal;
import com.ez.entity.Category;
import com.ez.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    @GetMapping("/categories")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<List<Category>> getAllCategories() {

//        List<Category> list = new ArrayList<>();
//        list = categoryService.getAllCategories();

        return new ResponseEntity<>(categoryService.getAllCategories(), OK);
    }
}
