package org.example.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getMe2() throws Exception {
        mockMvc.perform(get("/api/auth/me")
            .with(oidcLogin()
                .userInfoToken(token -> token
                        .claim("login", "testUser"))))
                .andExpect(status().isOk())
                .andExpect(content().string("testUser"));
    }


    @Test
    @DirtiesContext
    void getMe() throws Exception {
        mockMvc.perform(get("/api/auth/me")
            .with(oidcLogin()
                .userInfoToken(token -> token
                    .claim("login", """
                        {
                            "username": "testUser",
                            "avatarUrl": "testAvatarUrl"
                        }
                        """
        ))))
        .andExpect(status().isOk())
        .andExpect(content().json("""
            {
                "username": "testUser",
                "avatarUrl": "testAvatarUrl"
            }
            """
        ));
    }

}