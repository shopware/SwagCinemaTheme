import DomAccess from 'src/helper/dom-access.helper';
import Plugin from 'src/plugin-system/plugin.class';
import Iterator from 'src/helper/iterator.helper';

export default class CinemaCustomSelectPlugin extends Plugin {

    static options = {
        inputSelector: '.custom-select',
        dropdownSelector: 'dropdown-menu'
    };

    init() {
        this._inputElement = DomAccess.querySelector(this.el, this.options.inputSelector);
        this._registerCustomSelect();
    }

    _registerCustomSelect() {
        this._inputElement.removeEventListener('mousedown', this._createDropdown.bind(this));
        this._inputElement.addEventListener('mousedown', this._createDropdown.bind(this));
        this._inputElement.removeEventListener('keydown', this._createDropdown.bind(this));
        this._inputElement.addEventListener('keydown', this._createDropdown.bind(this));
    }

    _createDropdown(e) {
        let dropdownMenu = document.createElement('div');
        const ulElement = document.createElement('ul');
        const existedDropdown = this._inputElement.nextElementSibling &&  this._inputElement.nextElementSibling.classList.contains(this.options.dropdownSelector);

        if(e.code === 'Tab') return;

        e.preventDefault();

        if(e.code === 'ArrowDown' && this._inputElement.getAttribute('aria-expanded')) {
            return;
        }

        if(existedDropdown) {
            dropdownMenu =  this._inputElement.nextElementSibling;
            dropdownMenu.innerHTML = '';
        } else {
            dropdownMenu.className = this.options.dropdownSelector;
        };

        dropdownMenu.setAttribute('role', 'listbox');
        dropdownMenu.setAttribute('tabindex', 0);
        dropdownMenu.setAttribute('id', 'listbox' + this._inputElement.name);
        dropdownMenu.setAttribute('aria-labelledby', 'listboxlabel' + this._inputElement.name);

        Iterator.iterate(this._inputElement.options, item => {
            const liElement = document.createElement("li");

            liElement.classList.add('dropdown-item');
            liElement.setAttribute('value', item.getAttribute('value'));
            liElement.setAttribute('id','listbox-' + item.getAttribute('value'));
            liElement.setAttribute('tabindex', 0);
            liElement.textContent = item.textContent.trim();

            if(item.selected) {
                dropdownMenu.setAttribute('aria-activedescendant', 'listbox-' + item.getAttribute('value'));
                return;
            }

            if(item.getAttribute('disabled')) {
                liElement.classList.add('disabled');
                liElement.setAttribute('disabled', item.getAttribute('disabled'));
            } else {
                liElement.removeEventListener('click', this._onChange.bind(this));
                liElement.removeEventListener('keypress', this._onChange.bind(this));
                liElement.addEventListener('click', this._onChange.bind(this));
                liElement.addEventListener('keypress', this._onChange.bind(this));
            }

            ulElement.appendChild(liElement);
        });

        dropdownMenu.appendChild(ulElement);

        this._inputElement.parentElement.style.setProperty('position', 'relative', 'important');
        this._inputElement.setAttribute('aria-expanded', 'false');
        this._inputElement.setAttribute('data-toggle', 'dropdown');
        this._inputElement.setAttribute('data-boundary', 'viewport');
        this._inputElement.setAttribute('data-offset', '0,0');
        this._inputElement.setAttribute('aria-haspopup', 'true');
        this._inputElement.insertAdjacentElement('afterend', dropdownMenu);
    }

    _onChange(e) {
        this._inputElement.value = e.target.getAttribute('value');
        this._inputElement.nextElementSibling .setAttribute('aria-activedescendant', 'listbox-' + e.target.getAttribute('value'));
        this._inputElement.dispatchEvent(new Event('change', {bubbles: true}));
    }
}
