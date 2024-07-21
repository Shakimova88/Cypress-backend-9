describe('TechGlobal Student-Instructor API Tests', () => {
  const baseUrl = 'https://api.tech-global-training.com'
  let createdStudentId
  const uniqueEmail = `test.student.${Date.now()}@example.com`
  const studentDetails = {
    DOB: '2000-01-01',
    EMAIL: uniqueEmail,
    FIRST_NAME: 'Test',
    LAST_NAME: 'Student',
    INSTRUCTOR_ID: 1,
  }

  // Task-1: Get All Instructors
  it('should retrieve all instructors and validate the response', () => {
    cy.request(`${baseUrl}/instructors`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array').that.has.length(4)
      response.body.forEach((instructor) => {
        expect(instructor).to.have.property('INSTRUCTOR_ID')
        expect(instructor).to.have.property('FULLNAME')
        expect(instructor).to.have.property('STUDENTS').and.to.be.an('array')
      })
      const instructorIds = response.body.map((i) => i.INSTRUCTOR_ID)
      expect(instructorIds).to.have.members([1, 2, 3, 4])
    })
  })

  // Task-2: Get A Single Instructor
  it('should retrieve a single instructor and validate the response', () => {
    const instructorId = 1

    cy.request(`${baseUrl}/instructors/${instructorId}`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.all.keys('INSTRUCTOR_ID', 'FULLNAME', 'STUDENTS')
      expect(response.body.INSTRUCTOR_ID).to.eq(instructorId)
      expect(response.body.STUDENTS).to.be.an('array')
    })
  })

  // Task-3: Create a New Student and Validate the Instructor
  it('should create a new student and validate its association with the instructor', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/students`,
      body: studentDetails,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      expect(response.status).to.eq(201)
      createdStudentId = response.body.STUDENT_ID
      expect(response.body.STUDENT_ID).to.be.gt(2)
      expect(response.body.DOB).to.eq(studentDetails.DOB)
      expect(response.body.EMAIL).to.eq(studentDetails.EMAIL)
      expect(response.body.FIRST_NAME).to.eq(studentDetails.FIRST_NAME)
      expect(response.body.LAST_NAME).to.eq(studentDetails.LAST_NAME)
      expect(response.body.INSTRUCTOR_ID).to.eq(studentDetails.INSTRUCTOR_ID)
    })
  })

  // Task-4: Get Newly Created Student
  it('should retrieve the newly created student and validate the response', () => {
    cy.request(`${baseUrl}/students/${createdStudentId}`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.STUDENT_ID).to.eq(createdStudentId)
      expect(response.body.DOB).to.eq(`${studentDetails.DOB}T00:00:00.000Z`)
      expect(response.body.EMAIL).to.eq(studentDetails.EMAIL)
      expect(response.body.FIRST_NAME).to.eq(studentDetails.FIRST_NAME)
      expect(response.body.LAST_NAME).to.eq(studentDetails.LAST_NAME)
      expect(response.body.INSTRUCTOR_ID).to.eq(studentDetails.INSTRUCTOR_ID)
    })
  })

  // Task-5: Update Newly Created Student with a Different Instructor
  it('should update the newly created student with a different instructor and validate the response', () => {
    const updatedInstructorId = 2
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/students/${createdStudentId}`,
      body: {
        ...studentDetails,
        INSTRUCTOR_ID: updatedInstructorId,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  // Task-6: Delete Newly Created Student
  it('should delete the newly created student and validate the response', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/students/${createdStudentId}`,
    }).then((response) => {
      expect(response.status).to.eq(204)
      cy.request({
        method: 'GET',
        url: `${baseUrl}/students/${createdStudentId}`,
        failOnStatusCode: false,
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(404)
      })
    })
  })
})
