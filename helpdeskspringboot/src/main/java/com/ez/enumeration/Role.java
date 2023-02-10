package com.ez.enumeration;


public enum Role {
//    ROLE_USER(USER_AUTHORITIES),
//    ROLE_HR(HR_AUTHORITIES),
//    ROLE_MANAGER(MANAGER_AUTHORITIES),
//    ROLE_ADMIN(ADMIN_AUTHORITIES),
//    ROLE_SUPER_ADMIN(SUPER_ADMIN_AUTHORITIES);

    ROLE_CUSTOMER,
    ROLE_SUPPORTER,
    ROLE_ADMIN;
    private String[] authorities;

    Role(String... authorities) {
        this.authorities = authorities;
    }

    public String[] getAuthorities() {
        return authorities;
    }
}
