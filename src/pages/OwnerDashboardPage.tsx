import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { Users, FileText, UserCheck, TrendingUp, Target, Clock } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { useParams } from 'react-router-dom';
import { consultantsAPI, dashboardAPI } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { downloadUserDataAsExcel } from '@/utils/downloadExcelFile';
import { Button } from '@/components/ui/button';

interface DashboardData {
    totals: {
        clients: number;
        consultants: number;
        reports: number;
    };
    averages: {
        avgReportsPerClient: number;
        avgReportsPerConsultant: number;
    };
    topConsultantsByClients: Array<{
        _id: string;
        clients: number;
        consultantId: string;
        displayName: string;
    }>;
    clientGrowth: {
        monthly: Array<{
            value: number;
            date: string;
        }>;
        weekly: Array<{
            value: number;
            date: string;
        }>;
    };
    clientsByProvince: Array<{
        value: number;
        province: string | null;
    }>;
    coveragePct: number;
    recentReports: number;
    clbScoreDistribution: Array<{
        _id: string;
        distribution: Array<{
            clb: string;
            value: number;
        }>;
    }>;
    crsDistribution: Array<{
        range: string;
        value: number;
    }>;
}

const Dashboard: React.FC = () => {
    const [growthPeriod, setGrowthPeriod] = useState<'monthly' | 'weekly'>('monthly');
    const [dashboardData, setDashboardData] = useState<DashboardData>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'french'>('english');
    // const [clbData, setClbData] = useState<Array<{
    //     clb: string;
    //     value: number;
    // }>>([]);

    const handleDownloadUserData = async () => {
        const data = await consultantsAPI.downloadUserData();
        if (Array.isArray(data)) {
            downloadUserDataAsExcel(data, "ClientData.xlsx")
        } else {
            alert('invalid data received.')
        }
    }

    const handleDownloadFullUserData = async () => {
        const data = await consultantsAPI.downloadFullUserdata();
        if (Array.isArray(data)) {
            downloadUserDataAsExcel(data, "ClientFullData.xlsx")
        } else {
            alert('invalid data received.')
        }
    }


    const handleLanguageChange = (e: any) => {
        setSelectedLanguage(e.target.value);
        // if (dashboardData.clbScoreDistribution[0]._id === e.target.value.toLowerCase()) {
        //     setSelectedLanguage(dashboardData.clbScoreDistribution[0].distribution)
        // } else {
        //     setSelectedLanguage(dashboardData.clbScoreDistribution[0].distribution)
        // }
    }


    const { firmSlug } = useParams();

    const { firm } = useAuthStore();
    const fetchDashboardData = async () => {
        setIsLoading(true);
        const response = await dashboardAPI.getOwnerDashboardData(firm?._id);
        console.log(response);
        setDashboardData(response);
        // setClbData(response.clbScoreDistribution[1].distribution as string)
        setIsLoading(false);
    }


    useEffect(() => {
        fetchDashboardData();
    }, []);


    // const dashboardData: DashboardData = {
    //     "totals": {
    //         "clients": 6,
    //         "consultants": 3,
    //         "reports": 6
    //     },
    //     "averages": {
    //         "avgReportsPerClient": 1,
    //         "avgReportsPerConsultant": 2
    //     },
    //     "topConsultantsByClients": [
    //         {
    //             "_id": "68487c35b47da3094ea8bffc",
    //             "clients": 5,
    //             "consultantId": "68487c35b47da3094ea8bffc",
    //             "displayName": "deeppp"
    //         },
    //         {
    //             "_id": "6848788b159fb5f97eaaf807",
    //             "clients": 1,
    //             "consultantId": "6848788b159fb5f97eaaf807",
    //             "displayName": "new consultant"
    //         }
    //     ],
    //     "clientGrowth": {
    //         "monthly": [
    //             {
    //                 "value": 6,
    //                 "date": "2025-06"
    //             }
    //         ],
    //         "weekly": [
    //             {
    //                 "value": 4,
    //                 "date": "2025-W24"
    //             },
    //             {
    //                 "value": 2,
    //                 "date": "2025-W25"
    //             }
    //         ]
    //     },
    //     "clientsByProvince": [
    //         {
    //             "value": 6,
    //             "province": null
    //         }
    //     ],
    //     "coveragePct": 50,
    //     "recentReports": 6
    // };

    // Colors for pie chart
    const pieColors = [
        '#64748b', // slate-500
        '#475569', // slate-600
        '#334155', // slate-700
        '#1e293b', // slate-800
        '#0f172a', // slate-900
        '#000000', // black

        // Additional similar tones
        '#4b5563', // gray-600
        '#374151', // gray-700
        '#1f2937', // gray-800
        '#111827', // gray-900

        '#3b4252', // nord-gray (cool dark gray)
        '#2e3440', // nord-black (cool slate-black)
        '#2c3e50', // dark muted navy
        '#22303c', // deep blue-gray
        '#1c1e26', // carbon dark
    ];

    // Format growth data for chart
    const growthData = dashboardData?.clientGrowth[growthPeriod]?.map(item => ({
        ...item,
        displayDate: growthPeriod === 'monthly'
            ? new Date(item.date + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : item.date
    }));

    const clbData = dashboardData?.clbScoreDistribution?.find(item => item._id === selectedLanguage)?.distribution || [];


    // Format province data for pie chart
    const provinceData = dashboardData?.clientsByProvince?.map(item => ({
        name: item.province || 'Not Specified',
        value: item.value
    }));

    const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; subtitle?: string }> = ({ title, value, icon, subtitle }) => (
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


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Sidebar firmSlug={firmSlug} />
            <div className="min-h-screen bg-gray-100 p-6 ml-64">
                <div className="max-w-7xl mx-auto">
                    <div className='flex justify-between w-full items-center mb-8'>
                        <h1 className="text-3xl font-bold">Dashboard Analytics</h1>
                        <div className='flex gap-5'>
                            <Button
                                onClick={handleDownloadUserData}
                            >
                                Download Client Data
                            </Button>

                            <Button
                                onClick={handleDownloadFullUserData}
                            >
                                Download Full Client Data
                            </Button>
                        </div>

                    </div>
                    {/* Statistics Cards */}
                    <div className="flex flex-wrap gap-6 mb-8 w-full justify-center">
                        <StatCard
                            title="Total Clients"
                            value={dashboardData?.totals?.clients}
                            icon={<Users size={24} />}
                        />
                        <StatCard
                            title="Total Consultants"
                            value={dashboardData?.totals?.consultants}
                            icon={<UserCheck size={24} />}
                        />
                        <StatCard
                            title="Total Reports"
                            value={dashboardData?.totals?.reports}
                            icon={<FileText size={24} />}
                        />
                        <StatCard
                            title="Avg Reports/Client"
                            value={dashboardData?.averages?.avgReportsPerClient}
                            icon={<TrendingUp size={24} />}
                            subtitle={`${dashboardData?.averages?.avgReportsPerConsultant} per consultant`}
                        />
                        <StatCard
                            title="Coverage"
                            value={`${dashboardData?.coveragePct}%`}
                            icon={<Target size={24} />}
                            subtitle= '% of clients that have at least one report (coverage)'
                        />
                        <StatCard
                            title="Recent Reports"
                            value={dashboardData?.recentReports}
                            icon={<Clock size={24} />}
                            subtitle='Reports Generated in the last 30 days'
                        />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Client Growth Chart */}
                        <div className="bg-white p-6 rounded-lg border border-gray-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-black">Client Growth</h2>
                                <select
                                    value={growthPeriod}
                                    onChange={(e) => setGrowthPeriod(e.target.value as 'monthly' | 'weekly')}
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
                                            // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

                        {/* CLB Score Distribution Bar Chart with language selector */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">CLB Score Distribution</h2>
                                <select
                                    value={selectedLanguage}
                                    onChange={handleLanguageChange}
                                    className="bg-slate-700 text-white border border-slate-500 rounded px-2 py-1 text-sm"
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
                            {/* Province Pie Chart */}
                            {/* <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg border border-gray-300">
                                <h2 className="text-xl font-semibold text-black mb-6">Clients by Province</h2>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={dashboardData?.clientsByProvince}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#000000"
                                                dataKey="value"
                                            >
                                                {dashboardData?.clientsByProvince?.map((entry, index) => (
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
                                            <Legend wrapperStyle={{ color: '#94a3b8' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div> */}
                        </div>



                        {/* CRS Score Distribution Line Chart */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-semibold text-white mb-6">CRS Score Distribution</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dashboardData?.crsDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#00000" />
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

                    {/* Top Consultants */}
                    <div className="bg-white p-6 rounded-lg border border-gray-300">
                        <h2 className="text-xl font-semibold text-black mb-6">Top Consultants by Clients</h2>
                        <div className="space-y-4">
                            {dashboardData?.topConsultantsByClients?.map((consultant, index) => (
                                <div key={consultant._id} className="flex items-center justify-between p-4 bg-gray-100 border border-gray-300 text-black rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium">{consultant.displayName}</p>
                                            <p className="text-slate-400 text-sm">ID: {consultant.consultantId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-right">
                                        <p className="font-semibold">{consultant.clients}</p>
                                        <p className="text-slate-400 text-sm">clients</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;