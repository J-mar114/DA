const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const lb = document.getElementById('lightbox');
const scrollProgress = document.getElementById('scrollProgress');
const lbImg = document.getElementById('lb-img');
const lbTitle = document.getElementById('lb-title');
const lbDesc = document.getElementById('lb-desc');
const downloadBtn = document.getElementById('downloadBtn');
const btnText = document.getElementById('btnText');

let currentImgSrc = '';
let currentImgTitle = '';

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    themeIcon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
});

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
}

function openLightbox(src, title, desc) {
    currentImgSrc = src;
    currentImgTitle = title;
    lbImg.src = src;
    lbTitle.innerText = title;
    lbDesc.innerText = desc;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lb.style.display = 'none';
    document.body.style.overflow = 'auto';
    btnText.innerText = 'Download Full Resolution';
    downloadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
}

async function downloadCurrentImage() {
    if (!currentImgSrc) return;
    try {
        btnText.innerText = 'Preparing Download...';
        downloadBtn.classList.add('opacity-50', 'cursor-not-allowed');
        const response = await fetch(currentImgSrc);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentImgTitle.replace(/\s+/g, '_').toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        btnText.innerText = 'Download Started!';
        setTimeout(() => {
            btnText.innerText = 'Download Full Resolution';
            downloadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }, 2000);
    } catch (error) {
        const link = document.createElement('a');
        link.href = currentImgSrc;
        link.target = '_blank';
        link.click();
        btnText.innerText = 'Opening Source...';
        setTimeout(() => {
            btnText.innerText = 'Download Full Resolution';
            downloadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }, 2000);
    }
}

function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) el.classList.add('active');
    });
}

window.addEventListener('scroll', () => {
    reveal();
    updateScrollProgress();
}, { passive: true });
window.addEventListener('load', () => {
    reveal();
    updateScrollProgress();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
