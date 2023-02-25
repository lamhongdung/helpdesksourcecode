package com.ez.service;

import com.sun.mail.smtp.SMTPTransport;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Properties;

import static com.ez.constant.EmailConstant.*;
import static javax.mail.Message.RecipientType.CC;
import static javax.mail.Message.RecipientType.TO;

@Service
public class EmailService {

//    public void sendNewPasswordEmail(String firstName, String password, String email) throws MessagingException {
    public void sendEmail(String subject, String body, String email) throws MessagingException {

//        Message message = createEmail(firstName, password, email);
        Message message = createEmail(subject, body, email);

        SMTPTransport smtpTransport = (SMTPTransport) getEmailSession().getTransport(SIMPLE_MAIL_TRANSFER_PROTOCOL);
        smtpTransport.connect(GMAIL_SMTP_SERVER, USERNAME, PASSWORD);
        smtpTransport.sendMessage(message, message.getAllRecipients());

        smtpTransport.close();
    }

//    private Message createEmail(String firstName, String password, String email) throws MessagingException {
    private Message createEmail(String subject, String body, String email) throws MessagingException {

        Message message = new MimeMessage(getEmailSession());

        // dunglh13@gmail.com
        message.setFrom(new InternetAddress(FROM_EMAIL));

        message.setRecipients(TO, InternetAddress.parse(email, false));
        message.setRecipients(CC, InternetAddress.parse(CC_EMAIL, false));

//        message.setSubject(EMAIL_SUBJECT_CREATE_NEW_USER);
        message.setSubject(subject);

//        message.setText("Hello " + firstName + ", \n \n Your password to access the HelpDesk system is: " + password + "\n \n The Help Desk Team");
        message.setText(body);

        message.setSentDate(new Date());

        message.saveChanges();

        return message;
    }

    private Session getEmailSession() {

        Properties properties = System.getProperties();

        properties.put(SMTP_HOST, GMAIL_SMTP_SERVER);
        properties.put(SMTP_AUTH, true);
        properties.put(SMTP_PORT, DEFAULT_PORT);
        properties.put(SMTP_STARTTLS_ENABLE, true);
        properties.put(SMTP_STARTTLS_REQUIRED, true);

        return Session.getInstance(properties, null);
    }
}
