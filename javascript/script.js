<script>
        const animatedText = document.querySelector('.animated-text');

        function restartAnimation() {
            animatedText.classList.remove('animate');
            void animatedText.offsetWidth; // Trigger reflow
            animatedText.classList.add('animate');
        }
        setInterval(restartAnimation, 4000); // Restart every 4 seconds
</script>