package com.campuszen.backend.service;

import com.campuszen.backend.dto.residence.CreateResidenceRequest;
import com.campuszen.backend.dto.residence.JoinResidenceRequest;
import com.campuszen.backend.dto.residence.ResidenceResponse;
import com.campuszen.backend.model.Residence;
import com.campuszen.backend.model.User;
import com.campuszen.backend.repository.ResidenceRepository;
import com.campuszen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class ResidenceService {

    @Autowired
    private ResidenceRepository residenceRepository;

    @Autowired
    private UserRepository userRepository;

    public ResidenceResponse createResidence(CreateResidenceRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Générer un code unique
        String code = generateUniqueCode();

        Residence residence = new Residence();
        residence.setName(request.getName());
        residence.setAddress(request.getAddress());
        residence.setCode(code);

        Residence savedResidence = residenceRepository.save(residence);

        // Associer l'utilisateur à la résidence
        user.setResidence(savedResidence);
        userRepository.save(user);

        return convertToResponse(savedResidence);
    }

    public ResidenceResponse joinResidence(JoinResidenceRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Residence residence = residenceRepository.findByCode(request.getCode())
                .orElseThrow(() -> new RuntimeException("Code de résidence invalide"));

        user.setResidence(residence);
        userRepository.save(user);

        return convertToResponse(residence);
    }

    public ResidenceResponse getUserResidence(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResidence() == null) {
            return null;
        }

        return convertToResponse(user.getResidence());
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = "RES-" + String.format("%05d", new Random().nextInt(100000));
        } while (residenceRepository.existsByCode(code));
        return code;
    }

    private ResidenceResponse convertToResponse(Residence residence) {
        int memberCount = residence.getUsers() != null ? residence.getUsers().size() : 0;
        return new ResidenceResponse(
                residence.getId(),
                residence.getName(),
                residence.getAddress(),
                residence.getCode(),
                memberCount
        );
    }
}