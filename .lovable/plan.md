## Remove Language Switcher from Footer

The user has selected the language switcher (EL / EN toggle) in the footer and wants it removed. The component is used in two places — the header and the footer. We will remove it **only** from the footer.

### Change
- `src/routes/index.tsx`: Delete the `<LangSwitch />` element inside the Footer component.

No other changes are needed. The language switcher will remain in the header for navigation use.