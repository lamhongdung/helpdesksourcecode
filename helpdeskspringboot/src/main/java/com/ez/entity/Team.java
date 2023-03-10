package com.ez.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Team {

    @Id
    // GenerationType.IDENTITY: id is generated by mySQL
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Min(value = 1, message = "Value of id must be greater than or equal to 1")
    private Long id;

    @Size(min = 1, max = 50, message = "Length of the team name must be between 1 and 50 characters")
    private String name;

    @Pattern(regexp = "^[AM]$", message = "Value of assignment method must be 'A' or 'M'")
//    @Pattern(regexp = "^[0-9]{10}$", message="Phone number must be 10 digits length")
    private String assignmentMethod;

    @NotBlank(message = "Status must have value")
    private String status;

    public Team(String name, String assignmentMethod, String status) {

        this.name = name;
        this.assignmentMethod = assignmentMethod;
        this.status = status;

    }

}
