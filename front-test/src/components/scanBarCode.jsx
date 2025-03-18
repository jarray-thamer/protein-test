import React, { useState, useEffect, useRef } from "react";

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState("");
  const [scannedBarcode, setScannedBarcode] = useState("");
  const inputRef = useRef(null);

  // Focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleScan = (e) => {
    // Check if Enter key is pressed (most scanners send Enter after scan)
    if (e.key === "Enter") {
      e.preventDefault();

      // Save the scanned barcode for display
      setScannedBarcode(barcode);
      setBarcode(""); // Clear input for next scan
    }
  };

  return (
    <div>
      <h2>Codabar Scanner</h2>
      <input
        type="text"
        ref={inputRef}
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={handleScan}
        placeholder="Scan codabar"
        autoFocus
      />

      {scannedBarcode && (
        <div style={{ marginTop: "20px" }}>
          <h3>Scanned Codabar:</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {scannedBarcode}
          </p>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
