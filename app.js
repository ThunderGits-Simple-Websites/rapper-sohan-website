// DOM Elements
        const header = document.querySelector('header');
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('nav');
        const backToTop = document.querySelector('.back-to-top');
        const musicCards = document.querySelectorAll('.music-card');
        const musicPlayer = document.querySelector('.music-player');
        const playBtn = document.querySelector('.play-btn');
        const preloader = document.querySelector('.preloader');
        
        // Audio element for playing music
        let currentAudio = null;
        let isPlaying = false;
        
        // Event Listeners
        document.addEventListener('DOMContentLoaded', () => {
            // Hide preloader after page load
            setTimeout(() => {
                if (preloader) {
                    preloader.style.display = 'none';
                }
            }, 3000);
            
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                    
                    // Close mobile menu if open
                    if (nav && nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        // Reset hamburger to normal state
                        if (hamburger) {
                            hamburger.classList.remove('active');
                        }
                    }
                });
            });
        });
        
        // Header scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                if (header) {
                    header.style.padding = '1rem 10%';
                    header.style.background = 'rgba(0, 0, 0, 0.95)';
                }
                if (backToTop) {
                    backToTop.classList.add('active');
                }
            } else {
                if (header) {
                    header.style.padding = '1.5rem 10%';
                    header.style.background = 'rgba(0, 0, 0, 0.8)';
                }
                if (backToTop) {
                    backToTop.classList.remove('active');
                }
            }
        });
        
        // Mobile menu toggle with cross button functionality
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                if (nav) {
                    nav.classList.toggle('active');
                    // Toggle hamburger to cross
                    hamburger.classList.toggle('active');
                }
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (nav && nav.classList.contains('active')) {
                // Check if click is outside nav and hamburger
                if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                    nav.classList.remove('active');
                    if (hamburger) {
                        hamburger.classList.remove('active');
                    }
                }
            }
        });
        
        // Music player - CORRECTED SELECTORS
        musicCards.forEach(card => {
            card.addEventListener('click', () => {
                console.log('Music card clicked:', card);
                
                // Stop current audio if playing
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                
                if (musicPlayer) {
                    musicPlayer.classList.add('active');
                }
                
                // Update player info based on clicked card - FIXED SELECTORS
                const titleElement = card.querySelector('.music-info h3');
                const imgElement = card.querySelector('.music-thumb img');
                
                const title = titleElement ? titleElement.textContent : 'Unknown Song';
                const artist = 'Sohan';
                const img = imgElement ? imgElement.src : '';
                
                // Get audio source from data attribute
                const audioSrc = card.getAttribute('data-audio');
                console.log('Audio source:', audioSrc);
                
                // Update player display
                const playerTitle = document.querySelector('.player-title');
                const playerArtist = document.querySelector('.player-artist');
                const playerImg = document.querySelector('.player-img img');
                
                if (playerTitle) playerTitle.textContent = title;
                if (playerArtist) playerArtist.textContent = artist;
                if (playerImg && img) playerImg.src = img;
                
                // Create new audio element
                if (audioSrc) {
                    currentAudio = new Audio(audioSrc);
                    
                    // Audio event listeners
                    currentAudio.addEventListener('loadstart', () => {
                        console.log('Loading audio:', audioSrc);
                    });
                    
                    currentAudio.addEventListener('canplay', () => {
                        console.log('Audio ready to play');
                    });
                    
                    currentAudio.addEventListener('ended', () => {
                        resetPlayButton();
                        isPlaying = false;
                    });
                    
                    currentAudio.addEventListener('error', (e) => {
                        console.error('Audio error:', e);
                        console.error('Failed to load:', audioSrc);
                        alert('Error loading audio file: ' + audioSrc);
                        resetPlayButton();
                    });
                    
                    currentAudio.addEventListener('timeupdate', () => {
                        updateProgressBar();
                    });
                } else {
                    console.warn('No audio source found for this card');
                    alert('No audio file assigned to this song');
                }
                
                // Reset play button
                resetPlayButton();
                isPlaying = false;
            });
        });
        
        // Play button toggle with actual audio control
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                console.log('Play button clicked');
                
                if (!currentAudio) {
                    alert('Please select a song first');
                    return;
                }
                
                if (isPlaying) {
                    // Pause audio
                    currentAudio.pause();
                    resetPlayButton();
                    isPlaying = false;
                    console.log('Audio paused');
                } else {
                    // Play audio
                    currentAudio.play().then(() => {
                        playBtn.innerHTML = '⏸'; // Pause symbol
                        playBtn.classList.add('pause');
                        isPlaying = true;
                        console.log('Audio playing');
                    }).catch(error => {
                        console.error('Playback failed:', error);
                        alert('Failed to play audio. Please check the file format and path.');
                        resetPlayButton();
                    });
                }
            });
        }
        
        // Function to reset play button
        function resetPlayButton() {
            if (playBtn) {
                playBtn.innerHTML = '▶'; // Play symbol
                playBtn.classList.remove('pause');
            }
        }
        
        // Progress bar functionality
        function updateProgressBar() {
            if (currentAudio && isPlaying && currentAudio.duration) {
                const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
                const progressBar = document.querySelector('.progress');
                if (progressBar) {
                    progressBar.style.width = progress + '%';
                }
                
                // Update time display
                const currentTimeElement = document.querySelector('.current-time');
                const durationElement = document.querySelector('.duration');
                
                if (currentTimeElement) {
                    currentTimeElement.textContent = formatTime(currentAudio.currentTime);
                }
                if (durationElement) {
                    durationElement.textContent = formatTime(currentAudio.duration);
                }
            }
        }
        
        // Format time helper function
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        
        // Reveal animations on scroll
        const revealElements = document.querySelectorAll('.about, .music, .tour, .gallery, .contact');
        
        const revealOnScroll = () => {
            revealElements.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (sectionTop < windowHeight - 150) {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }
            });
        };
        
        // Apply initial styles
        revealElements.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.8s ease';
        });
        
        // Run animation on load and scroll
        window.addEventListener('load', revealOnScroll);
        window.addEventListener('scroll', revealOnScroll);
        
        console.log('JavaScript loaded successfully');