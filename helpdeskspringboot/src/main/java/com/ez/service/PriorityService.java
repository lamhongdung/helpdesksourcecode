package com.ez.service;

import com.ez.entity.Priority;
import com.ez.repository.PriorityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriorityService {

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private PriorityRepository priorityRepository;

    // search priorities by pageNumber and based on the search criteria.
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size
    //  - searchTerm: ID, name
    //  - reachInOpt: >=(gt), =(eq), <=(lt)
    //  - reachIn: number of hours to complete a ticket
    //  - status: '', 'Active', 'Inactive'
    public List<Priority> searchPriorities(int pageNumber, int pageSize, String searchTerm, String reachInOpt, long reachIn, String status) {

        LOGGER.info("search categories");

        return priorityRepository.searchPriorities(pageNumber, pageSize, searchTerm, reachInOpt, reachIn, status);
    }

    // calculate total of priorities based on the search criteria
    public long getTotalOfPriorities(String searchTerm, String reachInOpt, long reachIn, String status) {
        LOGGER.info("get total of priorities");

        return priorityRepository.getTotalOfPriorities(searchTerm, reachInOpt, reachIn, status);
    }

//    // create new category
//    public Category createCategory(Category category) {
//
//        LOGGER.info("create new category");
//
//        // new user
//        Category newCategory = new Category(category.getName(), category.getStatus());
//
//        // save new category into database
//        categoryRepository.save(newCategory);
//
//        return newCategory;
//    }
//
//    // find category by category id
//    public Category findById(Long id) throws CategoryNotFoundException {
//
//        LOGGER.info("find category by id");
//
//        // find category by category id
//        return categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException(NO_CATEGORY_FOUND_BY_ID + id));
//    }
//
//    // update existing category
//    public Category updateCategory(Category category) throws CategoryNotFoundException {
//
//        LOGGER.info("Update category");
//
//        // get existing category(persistent)
//        Category existingCategory = categoryRepository.findById(category.getId())
//                .orElseThrow(() -> new CategoryNotFoundException(NO_CATEGORY_FOUND_BY_ID + category.getId()));
//
//        // set new values to existing category
//        existingCategory.setName(category.getName());
//        existingCategory.setStatus(category.getStatus());
//
//        // update existing category(persistent)
//        categoryRepository.save(existingCategory);
//
//        return existingCategory;
//    }

}
