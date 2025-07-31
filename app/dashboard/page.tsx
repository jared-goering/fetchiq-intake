"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Trash2, Download, Loader2, ExternalLink, Eye } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface IntakeFormEntry {
  id: string
  companyName: string
  address: string
  city: string
  state: string
  country: string
  website: string
  socials?: {
    x?: string
    linkedin?: string
    instagram?: string
    tiktok?: string
    facebook?: string
  }
  team?: Array<{
    firstName: string
    lastName: string
    role: string
    linkedin?: string
    email: string
    phone?: string
    bio?: string
    skillsMarkets?: string
  }>
  operatingName?: string
  legalName?: string
  foundedDate?: string
  stage?: string
  problem?: string
  strengths?: string
  productTags?: string[]
  competition?: string
  traction?: string
  valuation?: string
  currency?: string
  keyCustomers?: string
  raising?: string
  amountRaising?: string
  salesRevenueRange?: string
  pmf?: string
  biz?: string
  vision?: string
  productVideo?: string
  bizVideo?: string
  companyLinkedIn?: string
  twitter?: string
  instagram?: string
  industryFit?: string
  industryFitAlt?: string
  productDescription?: string
  productType?: string
  revenueRange?: string
  tradeShows?: boolean
  currentAssets?: string
  submittedAt?: string
}

// Default password - should be changed via environment variable
const DASHBOARD_PASSWORD = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || "fetchiq2024"

export default function DashboardPage() {
  const [entries, setEntries] = useState<IntakeFormEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<IntakeFormEntry | null>(null)

  // Check if already authenticated via localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem("dashboardAuth")
    if (savedAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    // Set up real-time listener for intake forms
    const unsubscribe = onSnapshot(
      collection(db, "intakeForms"),
      (snapshot) => {
        const formEntries: IntakeFormEntry[] = []
        snapshot.forEach((doc) => {
          formEntries.push({
            id: doc.id,
            ...doc.data()
          } as IntakeFormEntry)
        })
        
        // Sort by submission date (newest first)
        formEntries.sort((a, b) => {
          const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
          const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
          return dateB - dateA
        })
        
        setEntries(formEntries)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching entries:", error)
        toast({
          title: "Error loading entries",
          description: "Failed to fetch intake form entries",
          variant: "destructive",
        })
        setLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [isAuthenticated])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === DASHBOARD_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("dashboardAuth", "true")
      setAuthError(false)
      setPassword("")
    } else {
      setAuthError(true)
      toast({
        title: "Invalid password",
        description: "Please enter the correct password to access the dashboard.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      await deleteDoc(doc(db, "intakeForms", id))
      toast({
        title: "Entry deleted",
        description: "The intake form entry has been successfully deleted.",
      })
      setDeleteId(null)
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast({
        title: "Error deleting entry",
        description: "Failed to delete the entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const exportToCSV = () => {
    if (entries.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no entries to export.",
        variant: "destructive",
      })
      return
    }

    // Define the CSV headers
    const headers = [
      "Company Name",
      "Operating Name",
      "Legal Name",
      "Address",
      "City",
      "State",
      "Country",
      "Website",
      "Founded Date",
      "Stage",
      "Team Members",
      "Problem",
      "Strengths",
      "Product Tags",
      "Competition",
      "Traction",
      "Valuation",
      "Currency",
      "Key Customers",
      "Raising",
      "Amount Raising",
      "Sales Revenue Range",
      "Revenue Range",
      "Current Assets",
      "Trade Shows",
      "PMF",
      "Business Model",
      "Vision",
      "Industry Fit",
      "Industry Fit Alt",
      "Product Description",
      "Product Type",
      "Product Video",
      "Business Video",
      "LinkedIn",
      "Twitter",
      "Instagram",
      "TikTok",
      "Facebook",
      "Submitted At"
    ]

    // Convert entries to CSV rows
    const rows = entries.map(entry => {
      const teamInfo = entry.team?.map(member => 
        `${member.firstName} ${member.lastName} (${member.role})`
      ).join("; ") || ""

      return [
        entry.companyName || "",
        entry.operatingName || "",
        entry.legalName || "",
        entry.address || "",
        entry.city || "",
        entry.state || "",
        entry.country || "",
        entry.website || "",
        entry.foundedDate || "",
        entry.stage || "",
        teamInfo,
        entry.problem || "",
        entry.strengths || "",
        entry.productTags?.join("; ") || "",
        entry.competition || "",
        entry.traction || "",
        entry.valuation || "",
        entry.currency || "",
        entry.keyCustomers || "",
        entry.raising || "",
        entry.amountRaising || "",
        entry.salesRevenueRange || "",
        entry.revenueRange || "",
        entry.currentAssets || "",
        entry.tradeShows ? "Yes" : "No",
        entry.pmf || "",
        entry.biz || "",
        entry.vision || "",
        entry.industryFit || "",
        entry.industryFitAlt || "",
        entry.productDescription || "",
        entry.productType || "",
        entry.productVideo || "",
        entry.bizVideo || "",
        entry.companyLinkedIn || entry.socials?.linkedin || "",
        entry.twitter || entry.socials?.x || "",
        entry.instagram || entry.socials?.instagram || "",
        entry.socials?.tiktok || "",
        entry.socials?.facebook || "",
        entry.submittedAt ? new Date(entry.submittedAt).toLocaleString() : ""
      ]
    })

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => 
        row.map(cell => {
          // Escape commas and quotes in cell content
          const escaped = cell.replace(/"/g, '""')
          return escaped.includes(",") || escaped.includes('"') || escaped.includes("\n") 
            ? `"${escaped}"` 
            : escaped
        }).join(",")
      )
    ].join("\n")

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `intake-forms-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: `Exported ${entries.length} entries to CSV.`,
    })
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not submitted"
    return new Date(dateString).toLocaleString()
  }

  const DetailRow = ({ label, value }: { label: string; value: string | undefined | null }) => {
    if (!value) return null
    return (
      <div className="grid grid-cols-3 gap-4 py-2">
        <div className="font-medium text-muted-foreground">{label}:</div>
        <div className="col-span-2">{value}</div>
      </div>
    )
  }

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Access</CardTitle>
            <CardDescription>
              Enter the password to access the intake form dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setAuthError(false)
                  }}
                  placeholder="Enter dashboard password"
                  className={authError ? "border-destructive" : ""}
                  autoFocus
                />
                {authError && (
                  <p className="text-sm text-destructive">Invalid password</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Intake Form Dashboard</CardTitle>
              <CardDescription>
                View and manage all submitted intake forms
              </CardDescription>
            </div>
            <Button onClick={exportToCSV} disabled={loading || entries.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No intake forms submitted yet.
            </div>
          ) : (
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Amount Raising</TableHead>
                    <TableHead>Team Size</TableHead>
                    <TableHead>Product Tags</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow 
                      key={entry.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{entry.companyName || "Unnamed"}</div>
                          {entry.website && (
                            <a
                              href={entry.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {entry.website}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {entry.city && entry.state ? `${entry.city}, ${entry.state}` : entry.city || entry.state || "N/A"}
                          {entry.country && <div className="text-muted-foreground">{entry.country}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {entry.stage ? (
                          <Badge variant="outline">{entry.stage}</Badge>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.amountRaising || <span className="text-muted-foreground">N/A</span>}
                      </TableCell>
                      <TableCell>
                        {entry.team?.length || 0} members
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {entry.productTags?.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {entry.productTags && entry.productTags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{entry.productTags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(entry.submittedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedEntry(entry)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteId(entry.id)
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEntry?.companyName || "Intake Form Details"}</DialogTitle>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="space-y-1">
                  <DetailRow label="Company Name" value={selectedEntry.companyName} />
                  <DetailRow label="Operating Name" value={selectedEntry.operatingName} />
                  <DetailRow label="Legal Name" value={selectedEntry.legalName} />
                  <DetailRow label="Founded Date" value={selectedEntry.foundedDate} />
                  <DetailRow label="Stage" value={selectedEntry.stage} />
                  <DetailRow label="Website" value={selectedEntry.website} />
                </div>
              </div>

              <Separator />

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="space-y-1">
                  <DetailRow label="Address" value={selectedEntry.address} />
                  <DetailRow label="City" value={selectedEntry.city} />
                  <DetailRow label="State" value={selectedEntry.state} />
                  <DetailRow label="Country" value={selectedEntry.country} />
                </div>
              </div>

              <Separator />

              {/* Team */}
              {selectedEntry.team && selectedEntry.team.length > 0 && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Team Members</h3>
                    {selectedEntry.team.map((member, index) => (
                      <div key={index} className="mb-4 p-4 bg-muted rounded-lg">
                        <div className="font-medium mb-2">
                          {member.firstName} {member.lastName} - {member.role}
                        </div>
                        <div className="space-y-1 text-sm">
                          <DetailRow label="Email" value={member.email} />
                          <DetailRow label="Phone" value={member.phone} />
                          <DetailRow label="LinkedIn" value={member.linkedin} />
                          <DetailRow label="Bio" value={member.bio} />
                          <DetailRow label="Skills/Markets" value={member.skillsMarkets} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                </>
              )}

              {/* Business Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Business Details</h3>
                <div className="space-y-1">
                  <DetailRow label="Problem" value={selectedEntry.problem} />
                  <DetailRow label="Strengths" value={selectedEntry.strengths} />
                  <DetailRow label="Competition" value={selectedEntry.competition} />
                  <DetailRow label="Traction" value={selectedEntry.traction} />
                  <DetailRow label="Key Customers" value={selectedEntry.keyCustomers} />
                  {selectedEntry.productTags && selectedEntry.productTags.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <div className="font-medium text-muted-foreground">Product Tags:</div>
                      <div className="col-span-2 flex flex-wrap gap-2">
                        {selectedEntry.productTags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Financial Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Financial Information</h3>
                <div className="space-y-1">
                  <DetailRow label="Valuation" value={selectedEntry.valuation} />
                  <DetailRow label="Currency" value={selectedEntry.currency} />
                  <DetailRow label="Raising" value={selectedEntry.raising} />
                  <DetailRow label="Amount Raising" value={selectedEntry.amountRaising} />
                  <DetailRow label="Sales Revenue Range" value={selectedEntry.salesRevenueRange} />
                  <DetailRow label="Revenue Range" value={selectedEntry.revenueRange} />
                  <DetailRow label="Current Assets" value={selectedEntry.currentAssets} />
                  <DetailRow label="Trade Shows" value={selectedEntry.tradeShows ? "Yes" : "No"} />
                </div>
              </div>

              <Separator />

              {/* Narratives */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Narratives</h3>
                <div className="space-y-3">
                  {selectedEntry.pmf && (
                    <div>
                      <div className="font-medium text-muted-foreground mb-1">Product-Market Fit:</div>
                      <div className="text-sm whitespace-pre-wrap">{selectedEntry.pmf}</div>
                    </div>
                  )}
                  {selectedEntry.biz && (
                    <div>
                      <div className="font-medium text-muted-foreground mb-1">Business Model:</div>
                      <div className="text-sm whitespace-pre-wrap">{selectedEntry.biz}</div>
                    </div>
                  )}
                  {selectedEntry.vision && (
                    <div>
                      <div className="font-medium text-muted-foreground mb-1">Vision:</div>
                      <div className="text-sm whitespace-pre-wrap">{selectedEntry.vision}</div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Industry Fit */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Industry Fit</h3>
                <div className="space-y-1">
                  <DetailRow label="Industry Fit" value={selectedEntry.industryFit} />
                  <DetailRow label="Industry Fit Alt" value={selectedEntry.industryFitAlt} />
                  <DetailRow label="Product Description" value={selectedEntry.productDescription} />
                  <DetailRow label="Product Type" value={selectedEntry.productType} />
                </div>
              </div>

              <Separator />

              {/* Social Media & Videos */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Social Media & Videos</h3>
                <div className="space-y-1">
                  <DetailRow label="Product Video" value={selectedEntry.productVideo} />
                  <DetailRow label="Business Video" value={selectedEntry.bizVideo} />
                  <DetailRow label="Company LinkedIn" value={selectedEntry.companyLinkedIn || selectedEntry.socials?.linkedin} />
                  <DetailRow label="Twitter/X" value={selectedEntry.twitter || selectedEntry.socials?.x} />
                  <DetailRow label="Instagram" value={selectedEntry.instagram || selectedEntry.socials?.instagram} />
                  <DetailRow label="TikTok" value={selectedEntry.socials?.tiktok} />
                  <DetailRow label="Facebook" value={selectedEntry.socials?.facebook} />
                </div>
              </div>

              <Separator />

              {/* Metadata */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Submission Information</h3>
                <div className="space-y-1">
                  <DetailRow label="Submitted At" value={formatDate(selectedEntry.submittedAt)} />
                  <DetailRow label="Entry ID" value={selectedEntry.id} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the intake form entry
              {deleteId && entries.find(e => e.id === deleteId)?.companyName && 
                ` for ${entries.find(e => e.id === deleteId)?.companyName}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 