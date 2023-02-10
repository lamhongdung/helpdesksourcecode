package com.ez.resource;

import com.ez.domain.HttpResponse;
import com.ez.domain.User;
import com.ez.domain.UserPrincipal;
import com.ez.exception.ExceptionHandling;
import com.ez.exception.domain.*;
import com.ez.service.UserService;
import com.ez.utility.JWTTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static com.ez.constant.FileConstant.*;
import static com.ez.constant.SecurityConstant.JWT_TOKEN_HEADER;
import static org.springframework.http.HttpStatus.*;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;

@RestController
@RequestMapping(path = {"/", "/user"})
public class UserResource extends ExceptionHandling {
    public static final String EMAIL_SENT = "An email with a new password was sent to: ";

    // no need this feature
    public static final String USER_DELETED_SUCCESSFULLY = "User deleted successfully";
    private AuthenticationManager authenticationManager;
    private UserService userService;
    private JWTTokenProvider jwtTokenProvider;

    @Autowired
    public UserResource(AuthenticationManager authenticationManager, UserService userService, JWTTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        // if username or password is invalid then throw an exception
        authenticate(user.getEmail(), user.getPassword());

        // authenticate success(username and password are correct)
//        User loginUser = userService.findUserByUsername(user.getUsername());
        User loginUser = userService.findUserByEmail(user.getEmail());

        // get generate JWT and send back to client
        UserPrincipal userPrincipal = new UserPrincipal(loginUser);
        HttpHeaders jwtHeader = getJwtHeader(userPrincipal);
        return new ResponseEntity<>(loginUser, jwtHeader, OK);
    }

//    @PostMapping("/register")
//    public ResponseEntity<User> register(@RequestBody User user) throws UserNotFoundException, UsernameExistException, EmailExistException, MessagingException {
//
//        // if register successful than send random password to register via email
//        User newUser = userService.register(user.getFirstName(), user.getLastName(), user.getUsername(), user.getEmail());
//        return new ResponseEntity<>(newUser, OK);
//    }

    // need to make a similar "/users"
//    @PostMapping("/add")
//    public ResponseEntity<User> addNewUser(@RequestParam("firstName") String firstName,
//                                           @RequestParam("lastName") String lastName,
//                                           @RequestParam("username") String username,
//                                           @RequestParam("email") String email,
//                                           @RequestParam("role") String role,
//                                           @RequestParam("isActive") String isActive
////                                           @RequestParam("isNonLocked") String isNonLocked,
////                                           @RequestParam(value = "profileImage", required = false) MultipartFile profileImage
//    ) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException, MessagingException {
////        User newUser = userService.addNewUser(firstName, lastName, username, email, role, Boolean.parseBoolean(isNonLocked), Boolean.parseBoolean(isActive), profileImage);
//        User newUser = userService.addNewUser(firstName, lastName, username, email, role, Boolean.parseBoolean(isActive));
//        return new ResponseEntity<>(newUser, OK);
//    }

//    @PostMapping("/update")
//    public ResponseEntity<User> update(@RequestParam("currentUsername") String currentUsername,
//                                       @RequestParam("firstName") String firstName,
//                                       @RequestParam("lastName") String lastName,
//                                       @RequestParam("username") String username,
//                                       @RequestParam("email") String email,
//                                       @RequestParam("role") String role,
//                                       @RequestParam("isActive") String isActive,
//                                       @RequestParam("isNonLocked") String isNonLocked,
//                                       @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException {
//        User updatedUser = userService.updateUser(currentUsername, firstName, lastName, username, email, role, Boolean.parseBoolean(isNonLocked), Boolean.parseBoolean(isActive), profileImage);
//        return new ResponseEntity<>(updatedUser, OK);
//    }

//    @GetMapping("/find/{username}")
//    public ResponseEntity<User> getUser(@PathVariable("username") String username) {
//        User user = userService.findUserByUsername(username);
//        return new ResponseEntity<>(user, OK);
//    }

    @GetMapping("/list")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getUsers();
        return new ResponseEntity<>(users, OK);
    }

//    @GetMapping("/resetpassword/{email}")
//    public ResponseEntity<HttpResponse> resetPassword(@PathVariable("email") String email) throws MessagingException, EmailNotFoundException {
//        userService.resetPassword(email);
//        return response(OK, EMAIL_SENT + email);
//    }

//    @DeleteMapping("/delete/{username}")
//    // The @PreAuthorize annotation checks the given expression before entering the method
////    @PreAuthorize("hasAnyAuthority('user:delete')")
////    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
////    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
//    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
//    public ResponseEntity<HttpResponse> deleteUser(@PathVariable("username") String username) throws IOException {
//        userService.deleteUser(username);
//        return response(OK, USER_DELETED_SUCCESSFULLY);
//    }

//    @PostMapping("/updateProfileImage")
//    public ResponseEntity<User> updateProfileImage(@RequestParam("username") String username, @RequestParam(value = "profileImage") MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException {
//        User user = userService.updateProfileImage(username, profileImage);
//        return new ResponseEntity<>(user, OK);
//    }

//    @GetMapping(path = "/image/{username}/{fileName}", produces = IMAGE_JPEG_VALUE)
//    public byte[] getProfileImage(@PathVariable("username") String username, @PathVariable("fileName") String fileName) throws IOException {
//        // ex: "user.home" + "/supportportal/user/dunglh/dunglh.jpg"
//        return Files.readAllBytes(Paths.get(USER_FOLDER + username + FORWARD_SLASH + fileName));
//    }

//    @GetMapping(path = "/image/profile/{username}", produces = IMAGE_JPEG_VALUE)
//    public byte[] getTempProfileImage(@PathVariable("username") String username) throws IOException {
//        URL url = new URL(TEMP_PROFILE_IMAGE_BASE_URL + username);
//        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
//        try (InputStream inputStream = url.openStream()) {
//            int bytesRead;
//            byte[] chunk = new byte[1024];
//            while ((bytesRead = inputStream.read(chunk)) > 0) {
//                // read each 1024 bytes: 0 - 1024, 0 - 1024, 0 - 1024,...
//                byteArrayOutputStream.write(chunk, 0, bytesRead);
//            }
//        }
//        return byteArrayOutputStream.toByteArray();
//    }

    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {
        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), httpStatus, httpStatus.getReasonPhrase().toUpperCase(),
                message), httpStatus);
    }

    private HttpHeaders getJwtHeader(UserPrincipal user) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJwtToken(user));
        return headers;
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }
}
