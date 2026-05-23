// ١. بەستەری فەرمی و زیندوی ئەپ سکریپتە نوێیەکەت
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxAYFTjTyNR7Ze18sbDy5YqrUytrvnNTAzJbw_hs5lqxzhLRgsmmOKGb_IKQU1i4Via/exec";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('conferenceForm');
    const userName = document.getElementById('userName');
    const userUniversity = document.getElementById('userUniversity');
    const userEmail = document.getElementById('userEmail');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownArrow = document.getElementById('dropdownArrow');
    const dropdownSelectedValue = document.getElementById('dropdownSelectedValue');
    const certOptionInput = document.getElementById('certOption');
    const codeContainer = document.getElementById('codeContainer');
    const verificationCodeInput = document.getElementById('verificationCode');

    const openProgramBtn = document.getElementById('openProgramBtn');
    const closeProgramBtn = document.getElementById('closeProgramBtn');
    const programModal = document.getElementById('programModal');

    // ٢. پاڵاوتنی توندی خانەکان (Input Validations) - مۆدی ڕێجێکسی هاوسەنگ
    
    // خانەی ناوی سیانی: تەنها ڕێگەدان بە دەقی کوردی/عەرەبی و سپەیس
    userName.addEventListener('input', function() {
        let start = this.selectionStart;
        let originalLength = this.value.length;
        
        // بردنی نیشانەی (-) بۆ کۆتایی فلتەرەکە بۆ ڕێگری لە قفڵبوونی خانەکە
        this.value = this.value.replace(/[0-9٠-٩0-۹A-Za-z`~!@#$%^&*()_+=\[\]{}|\\:;"'<>,.?\/؟٪\-]/g, '');
        
        let newLength = this.value.length;
        this.setSelectionRange(start - (originalLength - newLength), start - (originalLength - newLength));
    });

    // خانەی زانکۆ و کۆلێژ: تەنها ڕێگەدان بە دەقی کوردی/عەرەبی و سپەیس (ڕێک وەک ناوی سیانی)
    userUniversity.addEventListener('input', function() {
        let start = this.selectionStart;
        let originalLength = this.value.length;
        
        this.value = this.value.replace(/[0-9٠-٩0-۹A-Za-z`~!@#$%^&*()_+=\[\]{}|\\:;"'<>,.?\/؟٪\-]/g, '');
        
        let newLength = this.value.length;
        this.setSelectionRange(start - (originalLength - newLength), start - (originalLength - newLength));
    });

    // خانەی ئیمێڵ: تەنها پیتی ئینگلیزی، ژمارە و هێماکانی ئیمێڵ وەردەگرێت
    userEmail.addEventListener('input', function() {
        let start = this.selectionStart;
        let originalLength = this.value.length;
        
        this.value = this.value.replace(/[\u0600-\u06FF]/g, ''); 
        this.value = this.value.replace(/[^A-Za-z0-9@._\-]/g, ''); 
        
        let newLength = this.value.length;
        this.setSelectionRange(start - (originalLength - newLength), start - (originalLength - newLength));
    });

    // ٣. لۆژیکی کارکردنی دراپداونی مۆدێرن (Custom Dropdown)
    dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
        dropdownArrow.classList.toggle('rotate-180');
    });

    window.addEventListener('click', () => {
        dropdownMenu.classList.add('hidden');
        dropdownArrow.classList.remove('rotate-180');
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const text = this.innerText;

            dropdownSelectedValue.innerText = text;
            certOptionInput.value = value;
            dropdownMenu.classList.add('hidden');
            dropdownArrow.classList.remove('rotate-180');

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

    // ٤. مۆدێلی پڕۆگرامی کۆنفرانس (Modal)
    openProgramBtn.addEventListener('click', () => {
        programModal.classList.add('modal-active');
    });

    closeProgramBtn.addEventListener('click', () => {
        programModal.classList.remove('modal-active');
    });

    programModal.addEventListener('click', (e) => {
        if (e.target === programModal) {
            programModal.classList.remove('modal-active');
        }
    });

    // ٥. ناردنی فۆڕم و گونجاندن لەگەڵ مەرجەکانی سێرڤەر
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        btnText.innerText = "چاوەڕوانبە... ناردنی زانیارییەکان";

        const payload = {
            name: userName.value.trim(),
            university: userUniversity.value.trim(),
            email: userEmail.value.trim(),
            certOption: certOptionInput.value === 'بڕوانامە' ? 'certificate' : 'none',
            verificationCode: verificationCodeInput.value.trim()
        };

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' }, 
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.status === 'success') {
                showNotification("تۆمارکردن سەرکەوو بوو", "زانیارییەکانت بە سەرکەوتوویی تۆمارکران. ئیمێڵەکەت یان شیتەکە ببێنە.", "success");
                form.reset();
                dropdownSelectedValue.innerText = "بەشداربوون (بێ بڕوانامە - خۆڕایی)";
                certOptionInput.value = "بێ بڕوانامە";
                codeContainer.classList.add('hidden');
                verificationCodeInput.required = false;
            } else {
                let kurdishError = "هەڵەیەک لە سیستمەکەدا هەیە.";
                if (result.message === 'empty_code') kurdishError = "تکایە کۆدی دڵنیایی بنووسە.";
                if (result.message === 'code_used') kurdishError = "ئەم کۆدە پێشتر بەکارهاتووە!";
                if (result.message === 'invalid_code') kurdishError = "کۆدی دڵنیایی هەڵەیە و بوونی نییە!";
                
                showNotification("تۆمارکردن سەرکەوتوو نەبوو", kurdishError, "error");
            }

        } catch (error) {
            console.error("Fetch Error:", error);
            showNotification("تۆمارکردن نێردرا", "داواکارییەکە ئاڕاستەی گۆگڵ کرا. تکایە شیتەکەت بپشکنە.", "success");
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            btnText.innerText = "تۆمارکردنی بەشداربوون";
        }
    });

    // ٦. فەنکشنی تۆستەکان (Toasts)
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
    
    lucide.createIcons();
});
