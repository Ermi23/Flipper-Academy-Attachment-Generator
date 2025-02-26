<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\StudentTemplateExport;

class GenerateStudentTemplate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:student-template';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate an Excel template for student data import';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $fileName = 'student_template.xlsx';
        Excel::store(new StudentTemplateExport(), $fileName, 'public');
        $this->info("Template generated successfully: storage/app/public/{$fileName}");
    }
}
