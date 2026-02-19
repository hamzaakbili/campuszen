package com.campuszen.backend.service;

import com.campuszen.backend.dto.AuthResponse;
import com.campuszen.backend.dto.LoginRequest;
import com.campuszen.backend.dto.RegisterRequest;
import com.campuszen.backend.model.User;
import com.campuszen.backend.repository.UserRepository;
import com.campuszen.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Inscription
    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        // Créer le nouvel utilisateur
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash le mot de passe
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setCursus(request.getCursus());
        user.setRole(User.Role.STUDENT);

        // Sauvegarder en base
        userRepository.save(user);

        // Générer le token JWT
        String token = jwtTokenProvider.createToken(user.getEmail());

        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName());
    }

    // Connexion
    public AuthResponse login(LoginRequest request) {
        // Trouver l'utilisateur par email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        User user = userOptional.get();

        // Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        // Générer le token JWT
        String token = jwtTokenProvider.createToken(user.getEmail());

        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName());
    }
}