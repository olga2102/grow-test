const forms = document.querySelectorAll('form');
const errors = {
    requred: 'Поле является обязательным',
    emailIncorret: 'E-mail не корректный',
    phoneIncorrect: 'Номер телефона не корректный',
    minIncorrect: 'Минимальное значение: ',
    maxIncorrect: 'Максимальное значение: '
}

$("#tel").mask("+7 (999) 999-99-99", {
    autoclear: false
});

if (forms.length) {
    forms.forEach(function(form) {
        const fields = form.querySelectorAll('input.required, select.required');
        fields.forEach(function(field) {
            if (field.getAttribute('type') === 'email') {
                field.addEventListener('input', isWrongEmailInput, false);
            } else if (field.getAttribute('type') === 'tel') {
                field.addEventListener('blur', requiredTel, false);
            } else if (field.getAttribute('type') === 'number') {
                field.addEventListener('input', checkMinMaxValue, false);
            } else if (field.classList.contains('agreement')) {
                field.addEventListener('change', checkedAgreement, false);
            } else if (field.tagName === 'SELECT') {
                field.addEventListener('change', requiredSelect, false);
            } else {
                field.addEventListener('input', isRequiredFiled, false);
            }
            field.addEventListener('change', trimField, false);
        });
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isError = [];
            fields.forEach(function (field) {
                if (field.getAttribute('type') === 'email') {
                    const isWrongEmailInputWithContext = isWrongEmailInput.bind(field);
                    if (isWrongEmailInputWithContext()) isError.push(true);
                } else if (field.getAttribute('type') === 'tel') {
                    const requiredTelWithContext = requiredTel.bind(field);
                    if (requiredTelWithContext()) isError.push(true);
                } else if (field.getAttribute('type') === 'number') {
                    const checkMinMaxValueWithContext = checkMinMaxValue.bind(field);
                    if (checkMinMaxValueWithContext()) isError.push(true);
                } else if (field.classList.contains('agreement')) {
                    const checkedAgreementWithContext = checkedAgreement.bind(field);
                    if (checkedAgreementWithContext()) isError.push(true);
                } else if (field.tagName === 'SELECT') {
                    const requiredSelectWithContext = requiredSelect.bind(field);
                    if (requiredSelectWithContext()) isError.push(true);
                } else {
                    const isRequiredFiledWithContext = isRequiredFiled.bind(field);
                    if (isRequiredFiledWithContext()) isError.push(true);
                }
                const trimFieldWithContext = trimField.bind(field);
                trimFieldWithContext();
            });

            if (!isError.length) {
                // FETCH FORM
                const thanksNode = document.createElement('div');
                thanksNode.classList.add('form__thanks');
                thanksNode.innerHTML = 'Спасибо! Ваша заявка принята';
                form.append(thanksNode);
                setTimeout(function() {
                    fields.forEach(function(field) {
                        field.value = '';
                    });
                    thanksNode.parentNode.removeChild(thanksNode);
                }, 4000);
            }
        }, false);
    });
}

function trimField() {
    this.value = this.value.trim();
}

function setErrorState(context, errorNode, message = errors.requred) {
    if (!errorNode) {
        context.classList.add('error');
        const errorNode = document.createElement('div');
        errorNode.classList.add('form__error');
        errorNode.innerHTML = message;
        context.parentNode.append(errorNode);
    } else {
        errorNode.innerHTML = message;
    }
}

function resetErrorState(context, errorNode) {
    if (context.classList.contains('error')) context.classList.remove('error');
    if (errorNode) errorNode.parentNode.removeChild(errorNode);
}

function validateEmail(email) {
    return String(email)
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

function isWrongEmailInput() {
    const errorNode = this.parentNode.querySelector('.form__error');
    if (this.value.trim().length === 0) {
        setErrorState(this, errorNode);
        return true;
    }
    if (!validateEmail(this.value)) {
        setErrorState(this, errorNode, errors.emailIncorret);
    } else {
        resetErrorState(this, errorNode);
        return false;
    }
    return true;
}

function isRequiredFiled() {
    const errorNode = this.parentNode.querySelector('.form__error');
    if (this.value.trim().length === 0) {
        setErrorState(this, errorNode);
    } else {
        resetErrorState(this, errorNode);
        return false;
    }
    return true;
}

function checkMinMaxValue() {
    const errorNode = this.parentNode.querySelector('.form__error');
    const min = this.getAttribute('data-min');
    const max = this.getAttribute('data-max');
    if (!this.value) {
        setErrorState(this, errorNode);
        return true;
    } else {
        if (min && max) {
            if (Number(min) > Number(this.value)) {
                setErrorState(this, errorNode, errors.minIncorrect + min);
            } else if (Number(max) < Number(this.value)) {
                setErrorState(this, errorNode, errors.maxIncorrect + max);
            } else {
                resetErrorState(this, errorNode);
                return false;
            }
        } else if (min && Number(min) > Number(this.value)) {
            setErrorState(this, errorNode, errors.minIncorrect + min);
        } else if (max && Number(max) < Number(this.value)) {
            setErrorState(this, errorNode, errors.maxIncorrect + max);
        } else {
            resetErrorState(this, errorNode);
            return false;
        }
    }
}

function checkedAgreement() {
    const errorNode = this.parentNode.querySelector('.form__error');
    if (!this.checked) {
        setErrorState(this, errorNode);          
    } else {
        resetErrorState(this, errorNode);
        return false;
    }
    return true;
}

function requiredSelect() {
    const errorNode = this.parentNode.querySelector('.form__error');
    if (!this.value.trim().length) {
        setErrorState(this, errorNode);          
    } else {
        resetErrorState(this, errorNode);
        return false;
    }
    return true;
}

function requiredTel() {
    const errorNode = this.parentNode.querySelector('.form__error');
    if (!this.value.trim().length) {
        setErrorState(this, errorNode);          
    } else if (this.value.indexOf('_') >= 0) {
        setErrorState(this, errorNode, errors.phoneIncorrect);    
    } else {
        resetErrorState(this, errorNode);
        return false;
    }
    return true;
}