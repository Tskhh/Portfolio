const speakerForm = document.getElementById('speakerForm');
const captchaSection = document.querySelector('.sfp-captcha');
const recaptchaInput = document.getElementById('recaptcha');
const nameInputs = document.querySelectorAll('[data-validate="name"]');
const requiredFields = Array.from(document.querySelectorAll('[data-required="true"]'));
const durationInput = document.getElementById('duration');
const durationSlider = document.getElementById('durationSlider');
const phoneInput = document.getElementById('phone');
const fileUploadBox = document.getElementById('fileUploadBox');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');

const PHONE_TEMPLATE = '+7 (___) ___-__-__';
const DURATION_DEFAULT = 30;
let captchaVisible = false;
let persistedFiles = [];

const createFileListFromArray = (filesArray = []) => {
    if (!filesArray.length || typeof window === 'undefined' || typeof window.DataTransfer === 'undefined') {
        return null;
    }

    const dataTransfer = new DataTransfer();
    filesArray.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
};

const sanitizeNameValue = (value = '') =>
    value.replace(/[^A-Za-zА-Яа-яЁё\s\-–—]/g, '');

const hasMeaningfulChars = (value = '') => /[A-Za-zА-Яа-яЁё0-9]/.test(value);

const extractLocalDigits = (value = '') => {
    const digits = value.replace(/\D/g, '');
    const cleaned = digits.replace(/^[78]/, '');
    return cleaned.slice(0, 10);
};

const formatPhoneValue = (value = '') => {
    const digits = extractLocalDigits(value);
    let digitIndex = 0;
    let formatted = '';

    for (const char of PHONE_TEMPLATE) {
        if (char === '_') {
            formatted += digits[digitIndex] ?? '_';
            if (digitIndex < digits.length) {
                digitIndex += 1;
            }
        } else {
            formatted += char;
        }
    }

    return formatted;
};

const getPhoneDigitsCount = (value = '') => extractLocalDigits(value).length;

const formatFileSize = (size) => {
    if (!size && size !== 0) {
        return '';
    }

    const kilobytes = size / 1024;
    if (kilobytes >= 1024) {
        return `${(kilobytes / 1024).toFixed(1)} МБ`;
    }

    return `${Math.ceil(kilobytes)} КБ`;
};

const showCaptcha = () => {
    captchaVisible = true;
    captchaSection.classList.add('visible');
    captchaSection.setAttribute('aria-hidden', 'false');
    recaptchaInput.disabled = false;
    recaptchaInput.focus();
};

const hideCaptcha = () => {
    captchaVisible = false;
    captchaSection.classList.remove('visible');
    captchaSection.setAttribute('aria-hidden', 'true');
    recaptchaInput.checked = false;
    recaptchaInput.disabled = true;
};

const resetUploadState = () => {
    filePreview.innerHTML = '<p class="sfp-file-preview-placeholder">Файлы пока не добавлены</p>';
    fileUploadBox.classList.remove('dragover');
    fileUploadBox.classList.remove('has-files');
    fileInput.value = '';
    persistedFiles = [];
};

const toggleInvalidState = (input, isValid) => {
    if (!input) return;

    if (!isValid) {
        input.classList.add('invalid');
        input.setAttribute('aria-invalid', 'true');
    } else {
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
    }
};

const validateField = (input) => {
    if (!input) return true;
    const value = input.value.trim();
    let isValid = true;

    if (input.dataset.required === 'true' && !value) {
        isValid = false;
    }

    if (isValid && input.dataset.meaningful === 'true' && !hasMeaningfulChars(value)) {
        isValid = false;
    }

    if (isValid && input.dataset.phone === 'true') {
        isValid = getPhoneDigitsCount(value) === 10;
    }

    if (isValid && input.id === 'duration') {
        const numericValue = Number(value);
        const min = Number(input.min);
        const max = Number(input.max);
        isValid = Number.isFinite(numericValue) && numericValue >= min && numericValue <= max;
    }

    toggleInvalidState(input, isValid);
    return isValid;
};

const scrollToFirstInvalid = () => {
    const invalidField = requiredFields.find((field) => field.classList.contains('invalid'));
    if (invalidField) {
        invalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidField.focus({ preventScroll: true });
    }
};

const handleDurationInput = () => {
    const numericValue = durationInput.value.replace(/\D/g, '');
    if (!numericValue) {
        durationInput.value = '';
        return;
    }

    const clamped = Math.min(Math.max(Number(numericValue), Number(durationInput.min)), Number(durationInput.max));
    durationInput.value = clamped;
    durationSlider.value = clamped;
    toggleInvalidState(durationInput, true);
};

const handleDurationSlider = () => {
    durationInput.value = durationSlider.value;
    toggleInvalidState(durationInput, true);
};

const applyPhoneMask = () => {
    phoneInput.value = formatPhoneValue(phoneInput.value);
};

const handlePhoneFocus = () => {
    if (!phoneInput.value.trim()) {
        phoneInput.value = PHONE_TEMPLATE;
    }
};

const handlePhoneBlur = () => {
    if (!getPhoneDigitsCount(phoneInput.value)) {
        phoneInput.value = '';
        phoneInput.removeAttribute('aria-invalid');
        phoneInput.classList.remove('invalid');
    }
};

const synchronizeFiles = (files) => {
    const normalizedFiles = Array.isArray(files) ? files : Array.from(files ?? []);
    if (!normalizedFiles.length) {
        resetUploadState();
        return;
    }

    filePreview.innerHTML = '';
    fileUploadBox.classList.add('has-files');

    normalizedFiles.forEach((file) => {
        const item = document.createElement('div');
        item.className = 'sfp-file-preview-item';

        const thumb = document.createElement('div');
        thumb.className = 'sfp-file-preview-thumb';

        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            const reader = new FileReader();
            reader.onload = (event) => {
                img.src = event.target?.result;
            };
            reader.readAsDataURL(file);
            thumb.appendChild(img);
        } else {
            const format = document.createElement('span');
            format.className = 'sfp-file-format-icon';
            format.textContent = file.name.split('.').pop()?.slice(0, 4) ?? 'FILE';
            thumb.appendChild(format);
        }

        const textWrapper = document.createElement('div');
        const nameEl = document.createElement('div');
        nameEl.className = 'sfp-file-name';
        nameEl.textContent = file.name;

        const sizeEl = document.createElement('div');
        sizeEl.className = 'sfp-file-size';
        sizeEl.textContent = formatFileSize(file.size);

        textWrapper.append(nameEl, sizeEl);
        item.append(thumb, textWrapper);
        filePreview.appendChild(item);
    });
};

const updateFileInputFromPersisted = () => {
    const restored = createFileListFromArray(persistedFiles);
    if (restored) {
        fileInput.files = restored;
    } else if (!persistedFiles.length) {
        fileInput.value = '';
    }
};

const rememberFiles = (files, { append = false } = {}) => {
    if (!files) return;
    const incoming = Array.from(files);
    if (!incoming.length) return;

    persistedFiles = append ? [...persistedFiles, ...incoming] : incoming;
    updateFileInputFromPersisted();
    synchronizeFiles(persistedFiles);
};

const restorePersistedFiles = () => {
    if (!persistedFiles.length) {
        resetUploadState();
        return;
    }

    updateFileInputFromPersisted();
    synchronizeFiles(persistedFiles);
};

const attachDragAndDrop = () => {
    ['dragenter', 'dragover'].forEach((eventName) => {
        fileUploadBox.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
            fileUploadBox.classList.add('dragover');
        });
    });

    ['dragleave', 'dragend'].forEach((eventName) => {
        fileUploadBox.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
            fileUploadBox.classList.remove('dragover');
        });
    });

    fileUploadBox.addEventListener('drop', (event) => {
        event.preventDefault();
        fileUploadBox.classList.remove('dragover');
        const droppedFiles = event.dataTransfer?.files;
        if (!droppedFiles?.length) {
            return;
        }

        rememberFiles(droppedFiles, { append: true });
    });

    fileUploadBox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            fileInput.click();
        }
    });
};

const runFormValidation = () => {
    let isValid = true;
    requiredFields.forEach((field) => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    return isValid;
};

const resetFormState = () => {
    durationInput.value = DURATION_DEFAULT;
    durationSlider.value = DURATION_DEFAULT;
    phoneInput.value = '';
    resetUploadState();
    hideCaptcha();
};

// Init
hideCaptcha();
resetUploadState();
durationSlider.value = durationInput.value || DURATION_DEFAULT;

nameInputs.forEach((input) => {
    input.addEventListener('input', () => {
        const sanitized = sanitizeNameValue(input.value);
        if (sanitized !== input.value) {
            input.value = sanitized;
        }
        if (input.value.trim()) {
            toggleInvalidState(input, true);
        }
    });
});

requiredFields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) {
            validateField(field);
        }
    });
});

durationInput.addEventListener('input', handleDurationInput);
durationSlider.addEventListener('input', handleDurationSlider);

phoneInput.addEventListener('focus', handlePhoneFocus);
phoneInput.addEventListener('input', () => {
    applyPhoneMask();
    validateField(phoneInput);
});
phoneInput.addEventListener('blur', handlePhoneBlur);

fileInput.addEventListener('change', (event) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || !selectedFiles.length) {
        restorePersistedFiles();
        return;
    }

    rememberFiles(selectedFiles, { append: true });
});

attachDragAndDrop();

speakerForm.addEventListener('submit', (event) => {
    const formIsValid = runFormValidation();
    if (!formIsValid) {
        event.preventDefault();
        scrollToFirstInvalid();
        return;
    }

    if (!captchaVisible) {
        event.preventDefault();
        showCaptcha();
        captchaSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    if (!recaptchaInput.checked) {
        event.preventDefault();
        recaptchaInput.reportValidity();
        return;
    }

    event.preventDefault();
    alert('Форма отправлена!');
    speakerForm.reset();
    resetFormState();
});

