import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { Users, FileText, TrendingUp, Target, Clock, Calendar } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';

const ConsultantDashboard = () => {
    const [growthPeriod, setGrowthPeriod] = useState('monthly');
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const { firmSlug } = useParams();

    // API data
    const dashboardData = {
        "totals": {
            "clients": 5,
            "reports": 6
        },
        "averages": {
            "reportsPerClient": 1.2
        },
        "recency": {
            "lastReportAt": "2025-06-20T19:41:16.882Z"
        },
        "clientGrowth": {
            "monthly": [
                {
                    "count": 5,
                    "month": "2025-06"
                }
            ],
            "weekly": [
                {
                    "count": 3,
                    "week": "2025-W24"
                },
                {
                    "count": 2,
                    "week": "2025-W25"
                }
            ]
        },
        "clientsByProvince": [
            {
                "value": 5,
                "province": ""
            }
        ],
        "clbScoreDistribution": [
            {
                "_id": "english",
                "distribution": [
                    {
                        "clb": 7,
                        "value": 1
                    }
                ]
            },
            {
                "_id": "french",
                "distribution": [
                    {
                        "clb": 8,
                        "value": 1
                    }
                ]
            }
        ],
        "crsDistribution": [
            {
                "value": 1,
                "range": "0-99"
            },
            {
                "value": 4,
                "range": "100-199"
            },
            {
                "value": 1,
                "range": "200-299"
            }
        ]
    };

    // Colors for pie chart - matching your theme
    const pieColors = [
        '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#000000',
        '#4b5563', '#374151', '#1f2937', '#111827', '#3b4252', '#2e3440',
        '#2c3e50', '#22303c', '#1c1e26'
    ];

    // Format growth data for chart
    const growthData = dashboardData.clientGrowth[growthPeriod]?.map(item => ({
        ...item,
        value: item.count,
        displayDate: growthPeriod === 'monthly'
            ? new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : item.week
    }));

    // Format province data for pie chart
    const provinceData = dashboardData.clientsByProvince?.map(item => ({
        name: item.province || 'Not Specified',
        value: item.value
    }));

    // Get CLB data based on selected language
    const clbData = dashboardData.clbScoreDistribution.find(item => item._id === selectedLanguage)?.distribution || [];

    // Format last report date
    const formatLastReportDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const StatCard = ({ title, value, icon, subtitle }) => (
        <div className="bg-white p-6 rounded-lg border border-gray-300 w-full max-w-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-black text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && <p className="text-black text-xs mt-1">{subtitle}</p>}
                </div>
                <div className="text-black">
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Sidebar firmSlug={firmSlug}/>
            <div className="ml-64 min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className='flex justify-between w-full items-center mb-8'>
                        <h1 className="text-3xl font-bold">Dashboard Analytics</h1>
                    </div>

                    {/* Statistics Cards */}
                    <div className="flex flex-wrap gap-6 mb-8 w-full justify-center">
                        <StatCard
                            title="Total Clients"
                            value={dashboardData.totals.clients}
                            icon={<Users size={24} />} subtitle={undefined}                    />
                        <StatCard
                            title="Total Reports"
                            value={dashboardData.totals.reports}
                            icon={<FileText size={24} />} subtitle={undefined}                    />
                        <StatCard
                            title="Avg Reports/Client"
                            value={dashboardData.averages.reportsPerClient.toFixed(1)}
                            icon={<TrendingUp size={24} />} subtitle={undefined}                    />
                        {/* <StatCard
                            title="Last Report"
                            value={formatLastReportDate(dashboardData.recency.lastReportAt)}
                            icon={<Calendar size={24} />}
                            subtitle="Most recent report date"
                        /> */}
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Client Growth Chart */}
                        <div className="bg-white p-6 rounded-lg border border-gray-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-black">Client Growth</h2>
                                <select
                                    value={growthPeriod}
                                    onChange={(e) => setGrowthPeriod(e.target.value)}
                                    className="bg-white text-black px-3 py-2 rounded border border-black focus:outline-none focus:border-slate-500"
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={growthData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#000000" />
                                        <XAxis
                                            dataKey="displayDate"
                                            stroke="#000000"
                                            fontSize={12}
                                        />
                                        <YAxis
                                            stroke="#000000"
                                            fontSize={12}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #000000',
                                                borderRadius: '6px',
                                                color: '#000000'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#000000"
                                            strokeWidth={3}
                                            dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, fill: '#000000' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Clients by Province Chart */}
                        <div className="bg-white p-6 rounded-lg border border-gray-300">
                            <h2 className="text-xl font-semibold text-black mb-6">Clients by Province</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={provinceData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#000000"
                                            dataKey="value"
                                        >
                                            {provinceData?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #000000',
                                                borderRadius: '6px',
                                                color: '#000000'
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{ color: '#94a3b8' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* CLB Score Distribution Bar Chart */}
                        <div className="bg-white p-6 rounded-lg border border-gray-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-black">CLB Score Distribution</h2>
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="bg-white text-black border border-black rounded px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
                                >
                                    <option value="english">English</option>
                                    <option value="french">French</option>
                                </select>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={clbData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                        <XAxis
                                            dataKey="clb"
                                            stroke="#000000"
                                            fontSize={12}
                                            label={{ value: 'CLB Score', position: 'insideBottom', offset: 0, fill: '#000000' }}
                                        />
                                        <YAxis
                                            stroke="#000000"
                                            fontSize={12}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #000000',
                                                borderRadius: '6px',
                                                color: '#000000'
                                            }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="#475569"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* CRS Score Distribution Line Chart */}
                        <div className="bg-white p-6 rounded-lg border border-gray-300">
                            <h2 className="text-xl font-semibold text-black mb-6">CRS Score Distribution</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dashboardData.crsDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#000000" />
                                        <XAxis
                                            dataKey="range"
                                            stroke="#000000"
                                            fontSize={12}
                                        />
                                        <YAxis
                                            stroke="#000000"
                                            fontSize={12}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #000000',
                                                borderRadius: '6px',
                                                color: '#000000'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#000000"
                                            strokeWidth={3}
                                            dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, fill: '#000000' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConsultantDashboard;