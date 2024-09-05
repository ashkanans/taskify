package com.ashkanans.taskify.model;

import jakarta.persistence.*;

@Entity
@Table(name = "role", schema = "taskify")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role() {
    }

    public Role(String name, Long id) {
        this.name = name;
        this.id = id;
    }
}