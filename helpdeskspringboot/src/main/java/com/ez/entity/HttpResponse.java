package com.ez.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HttpResponse {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM-dd-yyyy hh:mm:ss", timezone = "America/New_York")
    private Date timeStamp;
    private int statusCode; // ex: 200, 201, 400, 500, ...
//    private HttpStatus httpStatus; // ex: "OK"
//    private String reason; // ex: "OK"
    private String message; // ex:" Your request was successful"

    public HttpResponse(int statusCode, String message) {

        this.timeStamp = new Date();
        this.statusCode = statusCode;
//        this.httpStatus = httpStatus;
//        this.reason = reason;
        this.message = message;
    }

//    public Date getTimeStamp() {
//        return timeStamp;
//    }
//
//    public void setTimeStamp(Date timeStamp) {
//        this.timeStamp = timeStamp;
//    }
//
//    public int getStatusCode() {
//        return statusCode;
//    }
//
//    public void setStatusCode(int statusCode) {
//        this.statusCode = statusCode;
//    }
//
//    public HttpStatus getHttpStatus() {
//        return httpStatus;
//    }
//
//    public void setHttpStatus(HttpStatus httpStatus) {
//        this.httpStatus = httpStatus;
//    }
//
//    public String getReason() {
//        return reason;
//    }
//
//    public void setReason(String reason) {
//        this.reason = reason;
//    }
//
//    public String getMessage() {
//        return message;
//    }
//
//    public void setMessage(String message) {
//        this.message = message;
//    }
}
