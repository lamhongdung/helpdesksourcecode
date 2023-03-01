package com.ez.service;

import com.ez.entity.Category;
import com.ez.entity.User;
import com.ez.repository.CategoryRepository;
import com.ez.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ez.constant.UserImplConstant.FOUND_USER_BY_EMAIL;

@Service
public class CategoryService{

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private CategoryRepository categoryRepository;

    // search categories by pageNumber and based on the search criteria.
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size
    //  - searchTerm: ID, name
    //  - status: '', 'Active', 'Inactive'
    public List<Category> searchCategories(int pageNumber, int pageSize, String searchTerm, String status){

        LOGGER.info("searchCategories");

        return categoryRepository.searchCategories(pageNumber, pageSize, searchTerm, status);
    }

    // calculate total of categories based on the search criteria
    public long getTotalOfCategories(String searchTerm, String status) {
        LOGGER.info("getTotalOfCategories");

        return categoryRepository.getTotalOfCategories(searchTerm, status);
    }

}
