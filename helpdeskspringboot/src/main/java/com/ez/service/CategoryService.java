package com.ez.service;

import com.ez.entity.Category;
import com.ez.repository.CategoryRepository;
import com.ez.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService{

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

}
