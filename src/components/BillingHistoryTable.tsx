import React from 'react';

interface BillingRecord {
  date: string;
  description: string;
  amount: number;
  status: string;
}

interface BillingHistoryTableProps {
  billingRecords: BillingRecord[];
}

const BillingHistoryTable: React.FC<BillingHistoryTableProps> = ({ billingRecords }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {billingRecords.map((record, index) => (
          <tr key={index}>
            <td>{record.date}</td>
            <td>{record.description}</td>
            <td>{record.amount}</td>
            <td>{record.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BillingHistoryTable;
