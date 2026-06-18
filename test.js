import { MEDICINES, searchMedicines, addCustomMedicine } from './frontend/src/constants/medicines.js';

console.log("Before:", searchMedicines("xyz"));
addCustomMedicine("xyz");
console.log("After:", searchMedicines("xyz"));
