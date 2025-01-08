// // resetPropertiesMixin.js
//
// export const resetPropertiesMixin = {
//   methods: {
//     resetDataProperties() {
//       const dataKeys = Object.keys(this.$data);
//       for (const key of dataKeys) {
//         if (key !== 'initialData' && Object.prototype.hasOwnProperty.call(this.initialData, key)) {
//           this[key] = this.initialData[key];
//         }
//       }
//     }
//   }
// };
