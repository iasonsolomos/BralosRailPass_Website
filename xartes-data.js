/* ==========================================================================
   xartes-data.js  —  ΚΕΙΜΕΝΑ ΤΗΣ ΣΕΛΙΔΑΣ «ΧΑΡΤΕΣ»
   Κάθε κουμπί της σελίδας (Ενιαίος Χάρτης, Μηκοτομή, Μελλοντικές Προσθήκες)
   έχει εδώ τον τίτλο και την περιγραφή του, στα ελληνικά και στα αγγλικά.
   Το κλειδί (π.χ. "enas") πρέπει να ταιριάζει με το data-map του κουμπιού
   και με το #/xartes/<κλειδί> του συνδέσμου.
   Οι ίδιοι οι χάρτες (Leaflet, μηκοτομή κ.λπ.) προστίθενται σε επόμενα βήματα.
   ========================================================================== */

const mapsData = {
  "enas": {
    title: { el: `Ένας Ενιαίος Χάρτης`, en: `One Unified Map` },
    desc: {
      el: `Διαδραστικός χάρτης της γραμμής με τους σταθμούς και τα σημεία ενδιαφέροντος. Πάτησε σε κάθε σημείο για να δεις την περιγραφή και τις φωτογραφίες του.`,
      en: `An interactive map of the line with its stations and points of interest. Click any point to see its description and photos.`
    }
  },
  "mikotomi": {
    title: { el: `Μηκοτομή`, en: `Longitudinal Profile` },
    desc: {
      el: `Η μηκοτομή της γραμμής: πώς μεταβάλλεται το υψόμετρο κατά μήκος της διαδρομής.`,
      en: `The longitudinal profile of the line: how the elevation changes along the route.`
    }
  },
  "mellon": {
    title: { el: `Μελλοντικές Προσθήκες`, en: `Future Additions` },
    desc: {
      el: `Νέοι χάρτες και υλικό που θα προστεθούν στο μέλλον.`,
      en: `New maps and material to be added in the future.`
    }
  }
};
