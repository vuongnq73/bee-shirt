package com.example.bee_shirt.controller;

import com.example.bee_shirt.entity.Contact;
import com.example.bee_shirt.repository.ContactRepository;
import com.example.bee_shirt.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contact")
public class ContactController {


    @Autowired
    private ContactService contactService;

    @Autowired
    private ContactRepository contactRepository;

    // API để lấy danh sách tất cả thông tin liên hệ
    @GetMapping("/")
    public ResponseEntity<List<Contact>> getAllContacts() {
        List<Contact> contacts = contactService.getAllContacts();
        return new ResponseEntity<>(contacts, HttpStatus.OK);
    }

    // API để thêm mới thông tin liên hệ
//    @PostMapping("/")
//    public ResponseEntity<String> saveContact(@RequestBody Contact contact) {
//        if (contact == null || contact.getName() == null || contact.getEmail() == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body("Invalid contact data. Name and email are required.");
//        }
//
//        contact.setCreated_at(LocalDateTime.now());
//        contactRepository.save(contact); // Lưu vào cơ sở dữ liệu
//        return ResponseEntity.ok("Contact saved successfully!");
//    }
    @PostMapping("/")
    public ResponseEntity<Map<String, String>> saveContact(@RequestBody Contact contact) {
        if (contact.getName() == null || contact.getEmail() == null || contact.getMessage() == null) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid input data");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

        // Giả lập lưu vào cơ sở dữ liệu
        System.out.println("Saving contact: " + contact);

        Map<String, String> successResponse = new HashMap<>();
        successResponse.put("message", "Contact saved successfully!");
        return ResponseEntity.ok(successResponse);
    }


    // API để lấy thông tin liên hệ theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        Optional<Contact> contact = contactService.getContactById(id);
        return contact.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // API để xóa thông tin liên hệ theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
