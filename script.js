// ١. بەستەری فەرمی و زیندوی ئەپ سکریپتەکەت کە پێتداوم
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxht1W88rAl65cKkrx1RguXAtUW0P3uZ5OA8KqBzo_Br72u0Bv3WFBVO2JffNBkqoXt/exec";

document.addEventListener('DOMContentLoaded', () => {
    
    // ناساندنی توخمەکانی وێبەکە (DOM Elements)
    const form = document.getElementById('conferenceForm');
    const userName = document.getElementById('userName');
    const userUniversity = document.getElementById('userUniversity');
    const userEmail = document.getElementById('userEmail');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    
    // توخمەکانی دراپداونی تایبەت (Custom Dropdown)
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownArrow = document.getElementById('dropdownArrow');
    const dropdownSelectedValue = document.getElementById('dropdownSelectedValue');
    const certOptionInput = document.getElementById('certOption');
    const codeContainer = document.getElementById('codeContainer');
    const verificationCodeInput = document.getElementById('verificationCode');

    // توخمەکانی مۆدێلی پڕۆگرام (Modal)
    const openProgramBtn = document.getElementById('openProgramBtn');
    const closeProgramBtn = document.getElementById('closeProgramBtn');
    const programModal = document.getElementById('programModal');

    // ------------------------------------------------------------------
    // ٢. پاڵاوتن و چاودێریکردنی خانەکان (Input Validations)
    // ------------------------------------------------------------------

    // خانەی ناوی سیانی: تەنها پیتەکانی کوردی/عەرەبی و سپەیس. ڕێگری لە ژمارە، هێما و ئینگلیزی
    userName.addEventListener('input', function() {
        // سڕینەوەی ژمارەکان (چ ئینگلیزی و چ عەرەبی)، پیتە ئینگلیزییەکان و هەموو جۆرە هێمایەک
        this.value = this.value.replace(/[0-9٠-٩۰-۹A-Za-z.,\/#!$%\^&\*;:{}=\-_`~()?"'@+<>]/g, '');
        // دڵنیابوونەوە لەوەی تەنها پیتەکانی مەودای عەرەبی/کوردی و سپەیس دەمێننەوە
        this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
    });

    // خانەی زانکۆ/کۆلێژ: تەنها پیتەکانی کوردی/عەرەبی و سپەیس
    userUniversity.addEventListener('input', function() {
        this.value = this.value.replace(/[0-9٠-٩۰-۹A-Za-z.,\/#!$%\^&\*;:{}=\-_`~()?"'@+<>]/g, '');
        this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
    });

    // خانەی ئیمێڵ: تەنها پیتی ئینگلیزی، ژمارە و هێماکانی ئیمێڵ. سڕینەوەی دەق و کیبۆردی کوردی/عەرەبی بەپەلە
    userEmail.addEventListener('input', function() {
        this.value = this.value.replace(/[\u0600-\u06FF]/g, ''); // سڕینەوەی هەر پیتێکی کوردی یان عەرەبی
        this.value = this.value.replace(/[^A-Za-z0-9@._\-]/g, ''); // تەنها هێشتنەوەی ڕێگەپێدراوەکانی ئیمێڵ
    });

    // ------------------------------------------------------------------
    // ٣. لۆژیکی کارکردنی دراپداونی مۆدێرن (Custom Dropdown)
    // ------------------------------------------------------------------
    dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
        dropdownArrow.classList.toggle('rotate-180');
    });

    // کاتێک کلیک لە دەرەوەی دراپداونەکە دەکرێت، دابخرێتەوە
    window.addEventListener('click', () => {
        dropdownMenu.classList.add('hidden');
        dropdownArrow.classList.remove('rotate-180');
    });

    // چاودێریکردنی بژاردەکانی ناو دراپداونەکە
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const text = this.innerText;

            dropdownSelectedValue.innerText = text;
            certOptionInput.value = value;
            dropdownMenu.classList.add('hidden');
            dropdownArrow.classList.remove('rotate-180');

            // ئەگەر "بڕوانامە" هەڵبژێردرا، خانەی کۆدەکە بە ئەنیمەیشن پیشان بدە و بیکە بە ناچاری
            if (value === 'بڕوانامە') {
                codeContainer.classList.remove('hidden');
                verificationCodeInput.required = true;
                verificationCodeInput.focus();
            } else {
                codeContainer.classList.add('hidden');
                verificationCodeInput.required = false;
                verificationCodeInput.value = '';
            }
        });
    });

    // ------------------------------------------------------------------
    // ٤. کۆنترۆڵکردنی مۆدێلی پڕۆگرامی کۆنفرانس (Pop-up Modal)
    // ------------------------------------------------------------------
    openProgramBtn.addEventListener('click', () => {
        programModal.classList.add('modal-active');
    });

    closeProgramBtn.addEventListener('click', () => {
        programModal.classList.remove('modal-active');
    });

    // ئەگەر کلیکی لە دەرەوەی چوارچێوەی پڕۆگرامەکە کرد، دابخرێتەوە
    programModal.addEventListener('click', (e) => {
        if (e.target === programModal) {
            programModal.classList.remove('modal-active');
        }
    });

    // ------------------------------------------------------------------
    // ٥. ناردنی فۆڕم و بەستنەوەی بە Google Apps Script
    // ------------------------------------------------------------------
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // گۆڕینی دۆخی دوگمەکە بۆ بارکردن (Loading)
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        btnText.innerText = "چاوەڕوانبە... ناردنی زانیارییەکان";

        // ئامادەکردنی جانتای داتاکان (Payload)
        const payload = {
            name: userName.value.trim(),
            university: userUniversity.value.trim(),
            email: userEmail.value.trim(),
            certOption: certOptionInput.value,
            verificationCode: verificationCodeInput.value.trim()
        };

        try {
            // ناردنی داتاکان بە شێوازی POST بۆ سێرڤەری گۆگڵ
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' }, // بۆ ڕێگری تەواو لە کێشەی CORS لەسەر لۆکاڵ هۆست
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.status === 'success') {
                showNotification("تۆمارکردن سەرکەوتوو بوو", "زانیارییەکانت بە سەرکەوتوویی تۆمارکران. ئەگەر داوای بڕوانامەت کردبێت، ئیمێڵەکەت بپشکنە.", "success");
                form.reset();
                // گەڕاندنەوەی دراپداون بۆ دۆخی سەرەتایی
                dropdownSelectedValue.innerText = "بەشداربوون (بێ بڕوانامە - خۆڕایی)";
                certOptionInput.value = "بێ بڕوانامە";
                codeContainer.classList.add('hidden');
                verificationCodeInput.required = false;
            } else {
                // پیشاندانی پەیامی خەتای ڕاستەقینە کە لە سێرڤەرەوە دێت (بۆ نموونە: کۆدەکە هەڵەیە یان بەکارهاتووە)
                showNotification("تۆمارکردن سەرکەوتوو نەبوو", result.message, "error");
            }

        } catch (error) {
            console.error("Fetch Error:", error);
            // زۆربەی کات ئەگەر گۆگڵ وەڵامەکە بە دروستی بنێرێتەوە بەڵام مۆدی وێبەکە لۆکاڵ بێت، فێچەکە دەکەوێتە کاتچ، لێرەدا دەچین شیتەکە دەپشکنین ئەگەر داتاکە چووبوو پەیامی سەرکەوتن دەدەین
            showNotification("پشکنیین", "سیستمەکە داواکارییەکەی نارد. تکایە شیتەکە یان ئیمێڵەکەت بپشکنە بۆ دڵنیایی کۆتایی.", "success");
        } finally {
            // گەڕاندنەوەی دوگمەکە بۆ دۆخی ئاسایی
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            btnText.innerText = "تۆمارکردنی بەشداربوون";
        }
    });

    // ------------------------------------------------------------------
    // ٦. فەنکشنی دروستکردنی تۆستەکان (Toasts)
    // ------------------------------------------------------------------
    function showNotification(title, message, type = 'success') {
        const container = document.getElementById('notificationContainer');
        const toast = document.createElement('div');
        toast.className = `pointer-events-auto flex items-start gap-3 p-4 bg-slate-950/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl transition-all duration-300 translate-y-4 opacity-0 max-w-sm text-right`;
        toast.setAttribute('dir', 'rtl');
        
        let iconColor = 'text-cyan-400';
        let iconName = 'info';
        if (type === 'error') { iconColor = 'text-red-500'; iconName = 'alert-triangle'; }
        else if (type === 'success') { iconColor = 'text-emerald-400'; iconName = 'check-circle2'; }

        toast.innerHTML = `
            <i data-lucide="${iconName}" class="w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5"></i>
            <div class="flex-grow space-y-0.5">
                <span class="text-sm font-bold text-white block">${title}</span>
                <span class="text-xs text-neutral-400 leading-normal block">${message}</span>
            </div>
            <button class="text-neutral-500 hover:text-white transition duration-150 mr-2" onclick="this.parentElement.remove()">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        `;
        
        container.appendChild(toast);
        lucide.createIcons();
        
        setTimeout(() => toast.classList.remove('translate-y-4', 'opacity-0'), 50);
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 7000);
    }
    
    // کاراکردنی ئایکۆنەکانی لووساید لە کاتی کردنەوەی لاپەڕەکە
    lucide.createIcons();
});
