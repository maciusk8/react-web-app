package com.project.perphorum;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.perphorum.model.AppUser;
import com.project.perphorum.model.Perfume;
import com.project.perphorum.model.Review;
import com.project.perphorum.model.Role;
import com.project.perphorum.repos.AppUserRepository;
import com.project.perphorum.repos.PerfumeRepository;
import com.project.perphorum.repos.ReviewRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Random;

@Component
public class DataLoader implements CommandLineRunner {

    private final PerfumeRepository perfumeRepository;
    private final AppUserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public DataLoader(PerfumeRepository perfumeRepository,
            AppUserRepository userRepository,
            ReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder,
            ObjectMapper objectMapper) {
        this.perfumeRepository = perfumeRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) {
        // Load perfumes from JSON
        if (perfumeRepository.count() < 50) {
            System.out.println("Perfume count is low (" + perfumeRepository.count() + "). Reloading data...");
            reviewRepository.deleteAll();
            perfumeRepository.deleteAll();

            try (InputStream inputStream = getClass().getResourceAsStream("/perfumes.json")) {
                if (inputStream == null) {
                    throw new IOException("file not found");
                }
                List<Perfume> perfumes = objectMapper.readValue(inputStream, new TypeReference<List<Perfume>>() {
                });
                perfumeRepository.saveAll(perfumes);
                System.out.println("success " + perfumes.size() + " loaded");
            } catch (IOException e) {
                System.out.println("import error: " + e.getMessage());
                e.printStackTrace();
            }
        }
        //LM GENERATED MOCK DATA
        // Create mock users
        if (userRepository.count() == 0) {

            // Team members
            createUser("maciej", "maciej123", Role.USER);
            createUser("mateusz", "mateusz123", Role.USER);
            createUser("prowadzacy", "admin123", Role.ADMIN);

            // Community members (to make the site feel alive)
            createUser("anna_perfumy", "anna123", Role.USER);
            createUser("piotr_k", "piotr123", Role.USER);
            createUser("kasia_scent", "kasia123", Role.USER);
            createUser("tomek_niche", "tomek123", Role.USER);
            createUser("ewa_luxury", "ewa123", Role.USER);
            createUser("jan_vintage", "jan123", Role.USER);
            createUser("magda_fresh", "magda123", Role.USER);
            createUser("pawel_woody", "pawel123", Role.USER);
            createUser("zofia_floral", "zofia123", Role.USER);
            createUser("adam_oud", "adam123", Role.USER);
            createUser("natalia_sweet", "natalia123", Role.USER);
            createUser("krzysztof_classic", "krzysztof123", Role.USER);
            createUser("aleksandra_chic", "ola123", Role.USER);
            createUser("bartosz_intense", "bartek123", Role.USER);
            createUser("monika_elegant", "monika123", Role.USER);

        }

        // Create sample reviews
        if (reviewRepository.count() == 0 && perfumeRepository.count() > 0) {

            List<Perfume> perfumes = perfumeRepository.findAll();
            List<AppUser> users = userRepository.findAll();
            Random random = new Random(42);

            String[] reviewTexts = {
                    "Fantastyczny zapach! Utrzymuje się cały dzień i zbiera same komplementy. Polecam każdemu!",
                    "Klasyka gatunku. Elegancki, męski, z charakterem. Idealny na wieczorne wyjścia.",
                    "Świeży i lekki, idealny na lato. Projekcja mogłaby być lepsza, ale ogólnie bardzo dobry.",
                    "Bardzo unikalny skład. Na początku zaskakujący, ale po chwili staje się uzależniający.",
                    "Dobry stosunek jakości do ceny. Nie jest to niche, ale robi swoje na co dzień.",
                    "Absolutnie przepiękny! Nuty kwiatowe są tu rewelacyjne. Mój nowy ulubieniec.",
                    "Trochę za słodki jak na mój gust, ale żona uwielbia. Dobre na randki.",
                    "Wow! To jest to czego szukałem latami. Elegancja w czystej postaci.",
                    "Solidny performer. 8+ godzin na skórze bez problemu. Silage świetny.",
                    "Miałem obawy przed zakupem, ale okazał się strzałem w dziesiątkę!",
                    "Za każdym razem gdy go noszę, dostaję komplementy. Must have!",
                    "Interesująca kompozycja, ale nie dla każdego. Warto przetestować przed zakupem.",
                    "Czuję się jak milioner kiedy go noszę. Premium w każdym calu.",
                    "Delikatny ale z charakterem. Świetny do biura i na co dzień.",
                    "Zakochałam się od pierwszego użycia! Ciepły, otulający, kobiecy.",
                    "Niszowy charakter, ale dostępna cena. Cenię za oryginalność.",
                    "Pierwsza butelka prawie skończona, czas na kolejną. Uzależniający!",
                    "Trwałość rewelacyjna - po 12h nadal czuję. Top tier perfumy.",
                    "Świetny na jesień i zimę. Ciepłe nuty drewna są genialne.",
                    "Kupowałem jako prezent i żona jest zachwycona. Sukces!",
                    "Nie rozumiem zachwytu innych... dla mnie zbyt intensywny.",
                    "Subtelny i elegancki. Idealne dopełnienie garnituru.",
                    "To jest definicja luksusu zamknięta w butelce.",
                    "Noszę codziennie do pracy. Dyskretny ale zauważalny.",
                    "Piękna ewolucja zapachu w ciągu dnia. Od świeżości do ciepła.",
                    "Mój signature scent od lat. Nie zmieniam na żaden inny.",
                    "Dostałam w prezencie i zakochałam się. Już zamówiłam drugą!",
                    "Kompozycja bardzo złożona - odkrywam nowe nuty za każdym razem.",
                    "Profesjonalny, elegancki, ale nie nudny. Świetny balance.",
                    "Na początku sceptyczny, teraz mój ulubiony w kolekcji.",
                    "Rewelacyjne otwarcie, piękne serce, trwała baza. Kompletny zapach!",
                    "Zdecydowanie numer jeden w mojej kolekcji ponad 50 flakonów.",
                    "Polecam na specjalne okazje. Robi niesamowite wrażenie.",
                    "Oryginalny, wyrafinowany, luksusowy. Wart każdej złotówki.",
                    "Kupowałem wiele razy i nigdy się nie zawodzę. Konsystentna jakość."
            };

            int[] ratings = { 5, 5, 4, 4, 4, 5, 3, 5, 5, 4, 5, 3, 5, 4, 5, 4, 5, 5, 4, 5, 2, 4, 5, 4, 5, 5, 5, 4, 4, 5,
                    5, 5, 5, 5, 5 };

            // Create reviews for first 100 perfumes to make the site feel alive
            int reviewCount = 0;
            int maxPerfumes = Math.min(100, perfumes.size());

            for (int i = 0; i < maxPerfumes; i++) {
                Perfume perfume = perfumes.get(i);

                // 1-4 reviews per perfume
                int numReviews = 1 + random.nextInt(4);

                for (int j = 0; j < numReviews; j++) {
                    AppUser user = users.get(random.nextInt(users.size()));
                    String text = reviewTexts[random.nextInt(reviewTexts.length)];
                    int rating = ratings[random.nextInt(ratings.length)];

                    Review review = new Review();
                    review.setSubject(perfume);
                    review.setAuthor(user);
                    review.setText(text);
                    review.setRating(rating);
                    reviewRepository.save(review);
                    reviewCount++;
                }
            }

        }
    }

    private void createUser(String username, String password, Role role) {
        AppUser user = new AppUser();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        userRepository.save(user);
    }
}