package com.ez.controller;

import com.ez.entity.Priority;
import com.ez.service.PriorityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
public class PriorityController {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    PriorityService priorityService;

    //
    // search priorities by pageNumber based on the search criteria
    //
    // url: ex: /priority-search?pageNumber=0&pageSize=5&searchTerm=""&reachInOpt="gt"&reachIn=0&status=""
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size(default = 5)
    //  - searchTerm: word to search(ID, name). '' is for search all
    //  - reachInOpt: gt(>=), eq(=), lt(<=)
    //  - reachIn: number of hours to complete a ticket
    //  - status: ''(all), 'Active', 'Inactive'
    @GetMapping("/priority-search")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<List<Priority>> searchPriorities(@RequestParam int pageNumber,
                                                           @RequestParam int pageSize,
                                                           @RequestParam(required = false, defaultValue = "") String searchTerm,
                                                           @RequestParam(required = false, defaultValue = "gt") String reachInOpt,
                                                           @RequestParam(required = false, defaultValue = "0") long reachIn,
                                                           @RequestParam(required = false, defaultValue = "") String status) {

        // get all priorities of 1 page
        List<Priority> priorities = priorityService.searchPriorities(pageNumber, pageSize, searchTerm, reachInOpt, reachIn, status);

        return new ResponseEntity<>(priorities, OK);
    }

    //
    // calculate total of priorities based on the search criteria.
    // use this total of priorities value to calculate total pages for pagination.
    //
    // url: ex: /total-of-priorities?searchTerm=""&reachInOpt="gt"&reachIn=0&status=""
    @GetMapping("/total-of-priorities")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Long> getTotalOfPriorities(@RequestParam(required = false, defaultValue = "") String searchTerm,
                                                     @RequestParam(required = false, defaultValue = "gt") String reachInOpt,
                                                     @RequestParam(required = false, defaultValue = "0") long reachIn,
                                                     @RequestParam(required = false, defaultValue = "") String status) {

        // calculate total of priorities based on the search criteria
        long totalOfPriorities = priorityService.getTotalOfPriorities(searchTerm, reachInOpt, reachIn, status);

        return new ResponseEntity<>(totalOfPriorities, HttpStatus.OK);
    }

//    @PostMapping("/category-create")
//    // only the ROLE_ADMIN can access this address
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
//    public ResponseEntity<Category> createCategory(@RequestBody @Valid Category category, BindingResult bindingResult)
//            throws BindException {
//
//        LOGGER.info("validate data");
//
//        // if category data is invalid then throw exception
//        if (bindingResult.hasErrors()) {
//
//            LOGGER.error("Category data is invalid");
//
//            throw new BindException(bindingResult);
//        }
//
//        Category newCategory = categoryService.createCategory(category);
//
//        return new ResponseEntity<>(newCategory, OK);
//    }
//
//    // find category by id.
//    // this method is used for Edit Category
//    @GetMapping("/category-list/{id}")
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
//    public ResponseEntity<Category> findById(@PathVariable Long id) throws CategoryNotFoundException {
//
//        LOGGER.info("find category by id: " + id);
//
//        Category category = categoryService.findById(id);
//
//        return new ResponseEntity<>(category, OK);
//    }
//
//    // edit existing category
//    @PutMapping("/category-edit")
//    // only the ROLE_ADMIN can access this address
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
//    public ResponseEntity<Category> editCategory(@RequestBody @Valid Category category, BindingResult bindingResult)
//            throws CategoryNotFoundException, BindException {
//
//        LOGGER.info("validate data");
//
//        // if category data is invalid then throw exception
//        if (bindingResult.hasErrors()) {
//
//            LOGGER.error("Category data is invalid");
//
//            throw new BindException(bindingResult);
//        }
//
//        Category currentCategory = categoryService.updateCategory(category);
//
//        return new ResponseEntity<>(currentCategory, OK);
//    }

}
