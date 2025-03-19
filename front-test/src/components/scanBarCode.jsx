import React, { useState, useEffect, useRef } from "react";

const BarcodeScanner = ({ onScan }) => {
  const [barcode, setBarcode] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onScan(barcode); // Trigger callback
      setBarcode("");
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        ref={inputRef}
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={handleScan}
        placeholder="Scan codabar"
        className="w-full p-2 border rounded"
        autoFocus
      />
    </div>
  );
};

export default BarcodeScanner;
