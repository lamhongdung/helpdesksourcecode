package com.ez.controller;

import com.ez.entity.Category;
import com.ez.entity.User;
import com.ez.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    //
    // search categories by pageNumber based on the search criteria
    //
    // url: ex: /category-search?pageNumber=0&pageSize=5&searchTerm=""&status=""
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size(default = 5)
    //  - searchTerm: word to search(ID, name). '' is for search all
    //  - status: category status. '' is for all status
    @GetMapping("/category-search")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<List<Category>> searchCategories(@RequestParam int pageNumber,
                                                           @RequestParam int pageSize,
                                                           @RequestParam(defaultValue = "") String searchTerm,
                                                           @RequestParam(defaultValue = "") String status) {

        // get all categories of 1 page
        List<Category> categories = categoryService.searchCategories(pageNumber, pageSize, searchTerm, status);

        return new ResponseEntity<List<Category>>(categories, OK);
    }

    //
    // calculate total of categories based on the search criteria.
    // use this total of categories value to calculate total pages for pagination.
    //
    // url: ex: /total-of-categories?searchTerm=""&status=""
    @GetMapping("/total-of-categories")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Long> getTotalOfCategories(@RequestParam(defaultValue = "") String searchTerm,
                                                     @RequestParam(defaultValue = "") String status) {

        // calculate total of categories based on the search criteria
        long totalOfCategories = categoryService.getTotalOfCategories(searchTerm, status);

        return new ResponseEntity<Long>(totalOfCategories, HttpStatus.OK);
    }

}
