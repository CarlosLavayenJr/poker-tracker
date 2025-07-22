'use client';

import { useState } from 'react';
import { PokerSession } from '../types/poker-session';
import { 
  calculateSessionStats, 
  getWeeklySummaries, 
  getMonthlySummaries,
  getLocationStats
} from '../services/api';

interface SessionSummaryProps {
  sessions: PokerSession[];
}

export default function SessionSummary({ sessions }: SessionSummaryProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'weekly' | 'monthly' | 'locations'>('overview');
  
  // Calculate overall statistics
  const stats = calculateSessionStats(sessions);
  
  // Get weekly summaries
  const weeklySummaries = getWeeklySummaries(sessions);
  
  // Get monthly summaries
  const monthlySummaries = getMonthlySummaries(sessions);
  
  // Get location statistics
  const locationStats = getLocationStats(sessions);
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format month for display
  const formatMonth = (monthString: string): string => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
  };
  
  // Format week for display
  const formatWeek = (weekString: string): string => {
    const date = new Date(weekString);
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 6);
    
    return `${formatDate(date.toISOString())} - ${formatDate(endDate.toISOString())}`;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Session Summary</h2>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'weekly'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('weekly')}
        >
          Weekly
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'monthly'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('monthly')}
        >
          Monthly
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'locations'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('locations')}
        >
          Locations
        </button>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-3">Overall Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Hours:</span>
                <span className="font-medium">{stats.totalHours.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Profit/Loss:</span>
                <span className={`font-medium ${stats.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${stats.totalProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hourly Rate:</span>
                <span className={`font-medium ${stats.totalHours > 0 ? (stats.totalProfit / stats.totalHours >= 0 ? 'text-green-500' : 'text-red-500') : ''}`}>
                  {stats.totalHours > 0 
                    ? `$${(stats.totalProfit / stats.totalHours).toFixed(2)}/hr` 
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-3">Best Performers</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Most Profitable Week:</span>
                <span className="font-medium">
                  {stats.mostProfitableWeek !== 'N/A' 
                    ? formatWeek(stats.mostProfitableWeek)
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Best Location:</span>
                <span className="font-medium">{stats.bestLocation}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Weekly Tab */}
      {activeTab === 'weekly' && (
        <div>
          {weeklySummaries.length === 0 ? (
            <p className="text-gray-500">No completed sessions available for weekly summary.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Week
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Profit/Loss
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Hourly Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {weeklySummaries.map((week, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatWeek(week.week)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {week.totalHours.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${week.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${week.totalProfit.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${week.totalHours > 0 ? (week.totalProfit / week.totalHours >= 0 ? 'text-green-500' : 'text-red-500') : ''}`}>
                          {week.totalHours > 0 
                            ? `$${(week.totalProfit / week.totalHours).toFixed(2)}/hr` 
                            : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Monthly Tab */}
      {activeTab === 'monthly' && (
        <div>
          {monthlySummaries.length === 0 ? (
            <p className="text-gray-500">No completed sessions available for monthly summary.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Profit/Loss
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Hourly Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {monthlySummaries.map((month, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatMonth(month.month)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {month.totalHours.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${month.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${month.totalProfit.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${month.totalHours > 0 ? (month.totalProfit / month.totalHours >= 0 ? 'text-green-500' : 'text-red-500') : ''}`}>
                          {month.totalHours > 0 
                            ? `$${(month.totalProfit / month.totalHours).toFixed(2)}/hr` 
                            : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div>
          {locationStats.length === 0 ? (
            <p className="text-gray-500">No completed sessions available for location statistics.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Profit/Loss
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Hourly Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {locationStats.map((location, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {location.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {location.totalHours.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${location.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${location.totalProfit.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${location.profitPerHour >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${location.profitPerHour.toFixed(2)}/hr
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}