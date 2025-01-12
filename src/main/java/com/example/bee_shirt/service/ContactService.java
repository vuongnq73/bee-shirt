package com.example.bee_shirt.service;

import com.example.bee_shirt.entity.Contact;
import com.example.bee_shirt.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;

    // Lưu thông tin liên hệ mới vào cơ sở dữ liệu
    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }

    // Lấy danh sách tất cả thông tin liên hệ
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    // Lấy thông tin liên hệ theo ID
    public Optional<Contact> getContactById(Long id) {
        return contactRepository.findById(id);
    }

    // Xóa thông tin liên hệ theo ID
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }
}
