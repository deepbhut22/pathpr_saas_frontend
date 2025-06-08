import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReportsStore } from '@/stores/reportsStore';
import { AlertTriangle, ArrowLeft, CheckCircle, ExternalLink, MessageSquare, Clipboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { alternativePrograms } from '@/utils/dummyData';

interface ReportViewProps {
  clientId: string;
  onBack: () => void;
  onOpenChat: () => void;
}

const ReportView = ({ clientId, onBack, onOpenChat }: ReportViewProps) => {
  const { selectedReport } = useReportsStore();
  const [showChatBox, setShowChatBox] = useState(false);

  if (!selectedReport) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No report selected</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const { content } = selectedReport;

  const eligiblePrograms = content?.pnp?.pnpAssessment?.filter((program) => program.status === 'Eligible');
  const noEligiblePrograms = content?.pnp?.pnpAssessment?.filter((program) => program.status !== 'Eligible');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Immigration Report</h1>
            <p className="text-gray-600">
              Generated on {new Date(selectedReport.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button onClick={onOpenChat}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat with MapleAI
        </Button>
      </div>

      <div className={`px-4 sm:px-6 lg:px-8 py-12 mx-auto ${showChatBox ? 'blur-sm' : ''}`}>
        <div className="w-[80%] mx-auto">
          <div className="space-y-8">
            <Card>
              <CardHeader className="bg-gray-200 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Express Entry Profile</CardTitle>
                  <div className="bg-primary-100 text-secondary-800 text-xs border-b-2 border-gray-600 font-medium px-2.5 py-0.5">
                    Primary Recommendation
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">Comprehensive Ranking System (CRS) Score
                        {/* <Info
                          onClick={() => {
                            setInfoName('crs')
                            setShowInfoDialog(true)
                          }}
                          className="w-4 h-4 cursor-pointer " /> */}
                      </h3>
                      <p className="text-secondary-600 text-sm">Based on your profile information</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary-950">{content?.expressEntry?.expressEntry?.crsScore}</div>
                      {/* <div className="text-2xl font-bold text-secondary-950">{expressEntryProfile?.expressEntryProfile?.crsScore !== 0 ? expressEntryProfile?.expressEntryProfile?.crsScore! - 10 : 0} - {expressEntryProfile?.expressEntryProfile?.crsScore! + 10}</div> */}
                      <div className="text-xs text-secondary-500">points</div>
                    </div>
                  </div>

                  <div className="border-t border-secondary-200 pt-4">
                    <h4 className="font-medium text-secondary-900 mb-3 underline">Score Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="flex-[1_1_0%] min-w-0 pr-2">
                          <h4 className="text-sm font-medium">Core/Human Capital Factors:</h4>
                          {content?.expressEntry?.expressEntry?.scoreBreakdown.coreHumanCapital?.reason?.map((bd, idx) =>
                            <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                          )}
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">
                          {content?.expressEntry?.expressEntry?.scoreBreakdown?.coreHumanCapital?.score} / {content?.expressEntry?.expressEntry?.scoreBreakdown?.coreHumanCapital?.maximum}
                        </span>
                      </div>

                      <hr className="my-2" />

                      <div className="flex justify-between items-center flex-wrap">
                        <div className="flex-[1_1_0%] min-w-0 pr-2">
                          <h4 className="text-sm font-medium">Spouse Factors : </h4>
                          {content?.expressEntry?.expressEntry?.scoreBreakdown.spouseFactors?.reason?.map((bd, idx) =>
                            <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                          )}
                        </div>
                        <span className="text-sm font-medium">{content?.expressEntry?.expressEntry?.scoreBreakdown?.spouseFactors?.score} / {content?.expressEntry?.expressEntry?.scoreBreakdown?.spouseFactors?.maximum}</span>
                      </div>

                      <hr className="my-2" />

                      <div className="flex justify-between items-center">
                        <div className="flex-[1_1_0%] min-w-0 pr-2">
                          <h4 className="text-sm font-medium">Skill Transferability : </h4>
                          {content?.expressEntry?.expressEntry?.scoreBreakdown.skillTransferability?.reason?.map((bd, idx) =>
                            <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                          )}
                        </div>
                        <span className="text-sm font-medium">{content?.expressEntry?.expressEntry?.scoreBreakdown?.skillTransferability?.score} / {content?.expressEntry?.expressEntry?.scoreBreakdown?.skillTransferability?.maximum}</span>
                      </div>

                      <hr className="my-2" />

                      <div className="flex justify-between items-center">
                        <div className="flex-[1_1_0%] min-w-0 pr-2">
                          <h4 className="text-sm font-medium">Additional Points : </h4>
                          {content?.expressEntry?.expressEntry?.scoreBreakdown.additionalPoints?.reason?.map((bd, idx) =>
                            <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                          )}
                        </div>
                        <span className="text-sm font-medium">{content?.expressEntry?.expressEntry?.scoreBreakdown?.additionalPoints?.score} / {content?.expressEntry?.expressEntry?.scoreBreakdown?.additionalPoints?.maximum}</span>

                      </div>
                    </div>
                  </div>


                  <div className="border-t border-secondary-200 pt-4">
                    <h4 className="font-medium text-secondary-900 mb-2 underline">Eligibility Status</h4>
                    <div className="flex items-start mt-2">
                      <div className="flex-shrink-0">
                        {content?.expressEntry?.eligibilityStatus[0]?.isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-secondary-900 flex items-center gap-2">
                          {content?.expressEntry?.eligibilityStatus[0]?.program}
                          {/* <Info
                            onClick={() => {
                              setInfoName('fswp')
                              setShowInfoDialog(true)
                            }}
                            className="w-4 h-4 cursor-pointer " /> <span className="text-xs text-secondary-600">Click to learn more</span> */}
                        </h5>
                        {content?.expressEntry?.eligibilityStatus[0]?.reason?.map((bd, idx) =>
                          <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start mt-4">
                      <div className="flex-shrink-0">
                        {content?.expressEntry?.eligibilityStatus[1]?.isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-secondary-900 flex items-center gap-2">
                          {content?.expressEntry?.eligibilityStatus[1]?.program}
                          {/* <Info
                            onClick={() => {
                              setInfoName('cec')
                              setShowInfoDialog(true)
                            }}
                            className="w-4 h-4 cursor-pointer " /> */}
                        </h5>
                        {content?.expressEntry?.eligibilityStatus[1]?.reason?.map((bd, idx) =>
                          <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start mt-4">
                      <div className="flex-shrink-0">
                        {content?.expressEntry?.eligibilityStatus[2]?.isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-secondary-900 flex items-center gap-2">
                          {content?.expressEntry?.eligibilityStatus[2]?.program}
                          {/* <Info
                            onClick={() => {
                              setInfoName('fstp')
                              setShowInfoDialog(true)
                            }}
                            className="w-4 h-4 cursor-pointer " /> */}
                        </h5>
                        {content?.expressEntry?.eligibilityStatus[2]?.reason?.map((bd, idx) =>
                          <p key={`additional-point-${idx}`} className="text-sm text-secondary-600">{bd}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-secondary-200 pt-4">
                    <h4 className="font-medium text-secondary-900 mb-2 underline">Category-Based Eligibility</h4>

                    {content?.expressEntry?.categoryBasedEligibility.map((eligibility, index) => (
                      <div
                        key={`eligibility-${index}`}
                        className="flex items-start mt-2"
                      >
                        <div className="flex-shrink-0">
                          {eligibility.isEligible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="ml-3">
                          <h5 className="text-sm font-medium text-secondary-900 flex items-center gap-2">
                            {eligibility.program}
                            {/* <Info
                              onClick={() => {
                                setInfoName(eligibility.program)
                                setShowInfoDialog(true)
                              }}
                              className="w-4 h-4 cursor-pointer " /> */}
                          </h5>
                          <p className="text-sm text-secondary-600">
                            {eligibility.reason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-primary-50">
                <div className="w-full flex justify-between items-center">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://ircc.canada.ca/english/immigrate/skilled/crs-tool.asp
  "
                    className="text-secondary-900 hover:text-secondary-950 text-sm font-medium flex items-center"
                  >
                    Learn more about Express Entry
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </CardFooter>
            </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className='flex flex-col gap-2 justify-between pdf-section' data-title="Provincial Nominee Program">
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>Provincial Nominee Program
                      {/* <Info
                        onClick={() => {
                          setInfoName('pnp')
                          setShowInfoDialog(true)
                        }}
                        className="w-4 h-4 cursor-pointer " /> */}
                    </CardTitle>
                  </CardHeader>
                  <CardContent >
                    <div className="space-y-4">
                      {eligiblePrograms?.length === 0 &&
                        <div>
                          <h4 className="text-sm font-medium text-yellow-500 mb-2">Since you are not eligible for any PNP, here are some suggestions:</h4>
                          {content?.pnp?.suggestions?.slice(0, 3).map((suggestion, index) => (
                            <div key={`pnp-suggestion-${index}`} className="flex items-start">
                              <div key={`pnp-suggestion-${index}`} className="flex items-start">
                                <div className="flex-shrink-0 w-full">
                                  <h3 className="text-sm font-medium text-secondary-900">{suggestion.action}</h3>
                                  <p className="text-sm text-secondary-600">{suggestion.reason}</p>
                                  {index !== 2 && <hr className="my-2" />}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      }
                      {eligiblePrograms?.slice(0, 3)?.map((program, index) => (
                        <div key={`pnp-${index}`} className="flex items-start">
                          <div className="flex-shrink-0">
                            {program.status === 'Eligible' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                          </div>
                          <div className="ml-3">
                            <h3>{program.province}</h3>
                            <h5 className="text-sm font-medium text-secondary-900">
                              {program.stream_name}
                            </h5>
                            <p className="text-sm text-secondary-600">
                              {program.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                      {eligiblePrograms && eligiblePrograms?.length > 3 && (<p className="text-sm italic text-secondary-600">You are eligible for total of {eligiblePrograms?.length} PNP programs. Click on the button below to view all options.</p>)}

                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button
                      // onClick={() => setShowPNPOptionsDialog(true)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      View All PNP Options
                    </Button>
                    <Button
                      // onClick={() => setShowSuggestions(true)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Show PNP Suggestions
                    </Button>
                  </CardFooter>
                </Card>

                <Card className='pdf-section flex flex-col gap-2 justify-between' data-title="Alternative Pathways">
                  <CardHeader>
                    <CardTitle>Alternative Pathways</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">


                      {alternativePrograms?.slice(0, 3).map((program, idx) => (
                        <div
                          key={`alternative-${idx}`}
                          className="flex items-start"
                        >
                          <div className="flex-shrink-0">
                            {program.status === 'Active' ? <CheckCircle className="h-5 w-5 text-green-500" /> : program.status === 'Temporarily Paused' ? <AlertTriangle className="h-5 w-5 text-yellow-500" /> : <AlertTriangle className="h-5 w-5 text-red-500" />}
                          </div>
                          <div className="ml-3">
                            <h5 className="text-sm font-medium text-secondary-900">
                              {program.title}
                            </h5>
                            <p className={`text-sm text-secondary-600 ${program.status === 'Active' ? 'text-green-400' : program.status === 'Temporarily Paused' ? 'text-yellow-500' : 'text-red-900'}`}>
                              {program.status}
                            </p>
                            <p className="text-sm text-secondary-600">
                              {program.description}
                            </p>
                          </div>
                        </div>

                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      // onClick={() => setShowAlternativePathwaysDialog(true)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Explore All Alternative Pathways
                    </Button>
                  </CardFooter>
                </Card>
              </div>

            <Card className='pdf-section' data-title="Next Steps and Recommendations">
              <CardHeader>
                <CardTitle>Next Steps and Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-3">Improve Your CRS Score</h4>
                    <ul className="space-y-3">

                      {content?.nextSteps?.map((recommendation, index) => (
                        <li
                          key={`recommendation-${index}`}
                          className="flex items-start"
                        >
                          <div className="flex-shrink-0 h-5 w-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-secondary-600">
                            <span className="font-medium text-secondary-900">{recommendation.question}</span> {recommendation.answer}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-secondary-200 pt-4">
                    <h4 className="font-medium text-secondary-900 mb-3">Required Documents</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Clipboard className="h-4 w-4 text-primary-500 mr-2" />
                        <span className="text-secondary-600">Valid passport</span>
                      </li>
                      <li className="flex items-center">
                        <Clipboard className="h-4 w-4 text-primary-500 mr-2" />
                        <span className="text-secondary-600">Language test results (IELTS, CELPIP, or TEF)</span>
                      </li>
                      <li className="flex items-center">
                        <Clipboard className="h-4 w-4 text-primary-500 mr-2" />
                        <span className="text-secondary-600">Educational Credential Assessment (ECA)</span>
                      </li>
                      <li className="flex items-center">
                        <Clipboard className="h-4 w-4 text-primary-500 mr-2" />
                        <span className="text-secondary-600">Proof of funds</span>
                      </li>
                      <li className="flex items-center">
                        <Clipboard className="h-4 w-4 text-primary-500 mr-2" />
                        <span className="text-secondary-600">Police clearance certificates</span>
                      </li>
                      <li className="flex items-center">
                        <Clipboard className="h-4 w-4 text-primary-500 mr-2" />
                        <span className="text-secondary-600">Medical examination results</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-secondary-900 mb-3">Timeline Estimate</h4>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary-900">Express Entry Profile Submission</span>
                        <span className="text-sm text-secondary-600">May 2025</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2.5 mb-6">
                        <div className="bg-gray-600 h-2.5 rounded-full w-[10%]"></div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary-900">Invitation to Apply (Estimated)</span>
                        <span className="text-sm text-secondary-600">July-Sep 2025</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2.5 mb-6">
                        <div className="bg-gray-600 h-2.5 rounded-full w-[30%]"></div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary-900">Application Processing</span>
                        <span className="text-sm text-secondary-600">6-9 months</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2.5 mb-6">
                        <div className="bg-gray-600 h-2.5 rounded-full w-[75%]"></div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary-900">Permanent Residence (Estimated)</span>
                        <span className="text-sm text-secondary-600">Q2-Q3 2026</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2.5">
                        <div className="bg-gray-600 h-2.5 rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className="text-sm text-secondary-600 italic">
              Disclaimer: These results are not immigration advice. If you want to learn more about the program, review the resources below.
            </p>
            <Link className="text-sm text-secondary-600 flex gap-1 hover:underline" to={"/resources"}><ExternalLink className="w-4 h-4" />View Resources</Link>
          </div>
        </div>
      </div>

      {/* Express Entry Profile */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Express Entry Profile
            <Badge variant="outline" className="text-lg">
              CRS Score: {content.expressEntry.expressEntry.crsScore}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Core Human Capital</p>
                  <p className="text-2xl font-bold">
                    {content.expressEntry.expressEntry.scoreBreakdown.coreHumanCapital.score}
                  </p>
                  <p className="text-sm text-gray-500">
                    / {content.expressEntry.expressEntry.scoreBreakdown.coreHumanCapital.maximum}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Spouse Factors</p>
                  <p className="text-2xl font-bold">
                    {content.expressEntry.expressEntry.scoreBreakdown.spouseFactors.score}
                  </p>
                  <p className="text-sm text-gray-500">
                    / {content.expressEntry.expressEntry.scoreBreakdown.spouseFactors.maximum}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Skill Transferability</p>
                  <p className="text-2xl font-bold">
                    {content.expressEntry.expressEntry.scoreBreakdown.skillTransferability.score}
                  </p>
                  <p className="text-sm text-gray-500">
                    / {content.expressEntry.expressEntry.scoreBreakdown.skillTransferability.maximum}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Additional Points</p>
                  <p className="text-2xl font-bold">
                    {content.expressEntry.expressEntry.scoreBreakdown.additionalPoints.score}
                  </p>
                  <p className="text-sm text-gray-500">
                    / {content.expressEntry.expressEntry.scoreBreakdown.additionalPoints.maximum}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Program Eligibility</h3>
            <div className="space-y-2">
              {content.expressEntry.eligibilityStatus.map((status, index) => (
                <div key={index} className="flex flex-col gap-2 border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{status.program}</span>
                    <Badge variant={status.isEligible ? "default" : "destructive"}>
                      {status.isEligible ? "Eligible" : "Not Eligible"}
                    </Badge>
                  </div>
                  {status.reason.length > 0 && (
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {status.reason.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Category Based Eligibility</h3>
            <div className="space-y-2">
              {content.expressEntry.categoryBasedEligibility.map((status, index) => (
                <div key={index} className="flex flex-col gap-2 border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{status.program}</span>
                    <Badge variant={status.isEligible ? "default" : "destructive"}>
                      {status.isEligible ? "Eligible" : "Not Eligible"}
                    </Badge>
                  </div>
                  {status.reason.length > 0 && (
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {status.reason.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* PNP Assessment */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Provincial Nominee Program (PNP)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.pnp.pnpAssessment.map((assessment, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{assessment.province}</h4>
                  <p className="text-sm text-gray-600">{assessment.stream_name}</p>
                </div>
                <Badge variant={assessment.status === 'eligible' ? 'default' : 'secondary'}>
                  {assessment.status}
                </Badge>
              </div>
              {assessment.reason.length > 0 && (
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {assessment.reason.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </CardContent>
      </Card> */}

      {/* Suggestions */}
      {/* {content.pnp.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {content.pnp.suggestions.map((suggestion, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium">{suggestion.action}</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                    {suggestion.reason.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
};

export default ReportView;
