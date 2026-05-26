import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

function InvoiceGenerator() {
  const invoiceRef = useRef();

  // =========================
  // FORM STATE
  // =========================
  const [formData, setFormData] = useState({
    firmName: "",
    firmAddress: "",
    firmPhone: "",
    gstNumber: "",

    customerName: "",
    customerAddress: "",
    customerPhone: "",

    invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
    invoiceDate: new Date().toISOString().split("T")[0],

    tax: 18,
    discount: 0,
    notes: "",
  });

  // =========================
  // PRODUCT ITEMS
  // =========================
  const [items, setItems] = useState([
    {
      itemName: "",
      quantity: 1,
      price: 0,
    },
  ]);

  // =========================
  // HANDLE FORM CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE PRODUCT CHANGE
  // =========================
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    updatedItems[index][field] = value;

    setItems(updatedItems);
  };

  // =========================
  // ADD PRODUCT
  // =========================
  const addItem = () => {
    setItems([
      ...items,
      {
        itemName: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  // =========================
  // REMOVE PRODUCT
  // =========================
  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);

    setItems(updatedItems);
  };

  // =========================
  // CALCULATIONS
  // =========================
  const subtotal = items.reduce(
    (acc, item) =>
      acc + Number(item.quantity) * Number(item.price),
    0
  );

  const taxAmount =
    (subtotal * Number(formData.tax || 0)) / 100;

  const finalTotal =
    subtotal + taxAmount - Number(formData.discount || 0);

  // =========================
  // DOWNLOAD PDF
  // =========================
  const downloadPDF = async () => {
    const element = invoiceRef.current;

    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgProperties = pdf.getImageProperties(data);

    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (imgProperties.height * pdfWidth) /
      imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save("invoice.pdf");
  };

  return (
    <div className="min-h-screen bg-black text-white p-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* ========================= */}
        {/* FORM SECTION */}
        {/* ========================= */}

        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-700">
          <h1 className="text-4xl font-bold text-red-500 mb-8">
            Invoice Generator
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Firm Name */}
            <InputField
              label="Firm Name"
              name="firmName"
              value={formData.firmName}
              onChange={handleChange}
            />

            {/* Firm Phone */}
            <InputField
              label="Firm Phone"
              name="firmPhone"
              value={formData.firmPhone}
              onChange={handleChange}
            />

            {/* GST */}
            <InputField
              label="GST Number"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
            />

            {/* Invoice Number */}
            <InputField
              label="Invoice Number"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
            />

            {/* Customer */}
            <InputField
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
            />

            {/* Customer Phone */}
            <InputField
              label="Customer Phone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
            />

            {/* Invoice Date */}
            <InputField
              label="Invoice Date"
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
            />

            {/* Tax */}
            <InputField
              label="Tax %"
              type="number"
              name="tax"
              value={formData.tax}
              onChange={handleChange}
            />

            {/* Discount */}
            <InputField
              label="Discount"
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
            />

            {/* Firm Address */}
            <div className="md:col-span-2">
              <TextAreaField
                label="Firm Address"
                name="firmAddress"
                value={formData.firmAddress}
                onChange={handleChange}
              />
            </div>

            {/* Customer Address */}
            <div className="md:col-span-2">
              <TextAreaField
                label="Customer Address"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ========================= */}
          {/* PRODUCTS */}
          {/* ========================= */}

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-5 text-red-400">
              Products
            </h2>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={item.itemName}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "itemName",
                        e.target.value
                      )
                    }
                    className="bg-black border border-zinc-600 rounded-lg px-4 py-3"
                  />

                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                    className="bg-black border border-zinc-600 rounded-lg px-4 py-3"
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "price",
                        e.target.value
                      )
                    }
                    className="bg-black border border-zinc-600 rounded-lg px-4 py-3"
                  />

                  <button
                    onClick={() => removeItem(index)}
                    className="bg-red-600 hover:bg-red-700 rounded-lg px-4 py-3"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="mt-5 bg-white text-black px-5 py-3 rounded-lg font-bold"
            >
              + Add Product
            </button>
          </div>

          {/* Notes */}
          <div className="mt-8">
            <TextAreaField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Download Button */}
          <button
            onClick={downloadPDF}
            className="w-full mt-8 bg-red-600 hover:bg-red-700 py-4 rounded-xl text-lg font-bold"
          >
            Download Invoice PDF
          </button>
        </div>

        {/* ========================= */}
        {/* PREVIEW SECTION */}
        {/* ========================= */}

        <div
          ref={invoiceRef}
          className="bg-white text-black p-10 rounded-2xl"
        >
          <div className="flex justify-between items-start border-b pb-5">
            <div>
              <h1 className="text-4xl font-bold">
                {formData.firmName || "Your Firm"}
              </h1>

              <p>Address: {formData.firmAddress}</p>

              <p> Phone: {formData.firmPhone}</p>

              <p>GST: {formData.gstNumber}</p>
            </div>

            <div className="text-right">
              <h2 className="text-3xl font-bold text-red-600">
                INVOICE
              </h2>

              <p>No: {formData.invoiceNumber}</p>

              <p>Date: {formData.invoiceDate}</p>
            </div>
          </div>

          {/* Customer */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">
              Bill To:
            </h3>

            <p>Customer  Name : {formData.customerName}</p>

            <p>Customer Address : {formData.customerAddress}</p>

            <p>Customer Phone : {formData.customerPhone}</p>
          </div>

          {/* Table */}
          <table className="w-full mt-8 border">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 border">Product</th>
                <th className="p-3 border">Qty</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="p-3 border">
                    {item.itemName}
                  </td>

                  <td className="p-3 border text-center">
                    {item.quantity}
                  </td>

                  <td className="p-3 border text-center">
                    ₹{item.price}
                  </td>

                  <td className="p-3 border text-center">
                    ₹
                    {Number(item.quantity) *
                      Number(item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-8 ml-auto w-72 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax ({formData.tax}%):</span>
              <span>₹{taxAmount}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount:</span>
              <span>₹{formData.discount}</span>
            </div>

            <div className="flex justify-between text-2xl font-bold border-t pt-3">
              <span>Total:</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-10">
            <h3 className="font-bold text-lg">Notes:</h3>

            <p>{formData.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================
// REUSABLE INPUT
// =========================

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-medium">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="bg-black border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
      />
    </div>
  );
}

// =========================
// REUSABLE TEXTAREA
// =========================

function TextAreaField({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-medium">
        {label}
      </label>

      <textarea
        rows="4"
        name={name}
        value={value}
        onChange={onChange}
        className="bg-black border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
      />
    </div>
  );
}

export default InvoiceGenerator;